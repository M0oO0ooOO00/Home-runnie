import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JoinRoomDto } from '@/chat/dto/room-join.dto';
import { CreateMessageDto, CreateMessageImageDto } from '@/chat/dto/create-message.dto';
import { Injectable, Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MemberRepository } from '@/member/repository';
import { ChatRepository } from '@/chat/repository';
import { ChatMessageImage } from '@/chat/domain';
import { JwtPayload } from '@/auth/types';
import { WsJwtGuard, WsSocketUser, WsUser, extractTokenFromSocket } from '@/chat/ws-jwt.guard';
import { ChatMessageType } from '@homerunnie/shared';
import { UploadService } from '@/upload';

@Injectable()
@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: (process.env.CORS_ORIGINS || 'http://localhost:3000,https://www.homerunnie.app').split(
      ',',
    ),
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly memberRepository: MemberRepository,
    private readonly chatRepository: ChatRepository,
    private readonly uploadService: UploadService,
  ) {}

  async handleConnection(socket: Socket) {
    try {
      const token = extractTokenFromSocket(socket);
      if (!token) {
        socket.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const result = await this.memberRepository.findMemberWithProfile(payload.memberId);
      const profile = result[0]?.profile;

      if (!profile) {
        socket.disconnect();
        return;
      }

      socket.data.user = {
        memberId: payload.memberId,
        nickname: profile.nickname,
        supportTeam: profile.supportTeam,
        roomIds: new Set<string>(),
      } satisfies WsSocketUser;

      socket.emit('authenticated');
      this.logger.log(`client connected: ${profile.nickname} (${socket.id})`);
    } catch {
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`client disconnected: ${socket.id}`);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @WsUser() user: WsSocketUser,
    @MessageBody() data: JoinRoomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const { roomId } = data;
    const { nickname } = user;
    const chatRoomId = this.parseRoomId(roomId);
    if (chatRoomId === null) return;

    const roomMember = await this.chatRepository.findChatRoomMember(chatRoomId, user.memberId);
    if (!roomMember) return;

    socket.join(roomId);
    user.roomIds.add(roomId);

    // 읽음 처리
    await this.chatRepository.updateLastReadAt(chatRoomId, user.memberId);

    const history = await this.chatRepository.findMessagesByRoomId(chatRoomId);
    socket.emit(
      'message_history',
      history.map((msg) => ({
        id: msg.id,
        message: msg.content ?? '',
        type: msg.messageType,
        attachments: msg.images.map((image) => this.mapImage(image)),
        isOwn: msg.senderId === user.memberId,
        nickname: msg.nickname,
        supportTeam: msg.supportTeam,
        createdAt: msg.createdAt,
      })),
    );

    this.logger.log(`${nickname} joined room ${roomId}`);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('message')
  async handleMessage(
    @WsUser() user: WsSocketUser,
    @MessageBody() data: CreateMessageDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const { message, roomId } = data;

    if (!user.roomIds.has(roomId)) return;

    const { nickname, memberId, supportTeam } = user;
    const chatRoomId = this.parseRoomId(roomId);
    if (chatRoomId === null) return;

    const roomMember = await this.chatRepository.findChatRoomMember(chatRoomId, memberId);
    if (!roomMember) {
      user.roomIds.delete(roomId);
      return;
    }

    const attachments = data.attachments ?? [];
    const messageType =
      data.type ?? (attachments.length > 0 ? ChatMessageType.IMAGE : ChatMessageType.TEXT);
    const content = message?.trim() || null;

    if (messageType === ChatMessageType.TEXT && !content) return;
    if (messageType === ChatMessageType.IMAGE && attachments.length === 0) return;
    if (messageType === ChatMessageType.TEXT && attachments.length > 0) return;

    if (
      messageType === ChatMessageType.IMAGE &&
      !attachments.every((image) => this.isValidChatImage(chatRoomId, memberId, image))
    ) {
      return;
    }

    let savedMessage;
    let savedImages: (typeof ChatMessageImage.$inferSelect)[] = [];

    if (messageType === ChatMessageType.IMAGE) {
      const saved = await this.chatRepository.saveImageMessage(
        chatRoomId,
        memberId,
        content,
        attachments,
      );
      savedMessage = saved.message;
      savedImages = saved.images;
    } else {
      [savedMessage] = await Promise.all([
        this.chatRepository.saveMessage(chatRoomId, memberId, content as string),
        this.chatRepository.updateChatRoomUpdatedAt(chatRoomId),
      ]);
    }

    const receivedMessage = {
      id: savedMessage.id,
      nickname,
      message: savedMessage.content ?? '',
      type: savedMessage.messageType,
      attachments: savedImages.map((image) => this.mapImage(image)),
      roomId,
      supportTeam,
      createdAt: savedMessage.createdAt,
    };

    socket.to(roomId).emit('received_message', {
      ...receivedMessage,
      isOwn: false,
    });
    socket.emit('received_message', {
      ...receivedMessage,
      isOwn: true,
    });
  }

  private parseRoomId(roomId: string): number | null {
    const parsed = Number(roomId);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  }

  private isValidChatImage(
    roomId: number,
    memberId: number,
    image: CreateMessageImageDto,
  ): boolean {
    return this.uploadService.isValidChatImageMetadata(roomId, memberId, image);
  }

  private mapImage(image: {
    id: number;
    imageUrl: string;
    mimeType: string;
    fileSize: number;
    imageOrder: number;
  }) {
    return {
      id: image.id,
      imageUrl: image.imageUrl,
      mimeType: image.mimeType,
      fileSize: image.fileSize,
      imageOrder: image.imageOrder,
    };
  }

  emitToRoom(roomId: string, event: string, data: unknown) {
    this.server.to(roomId).emit(event, data);
  }

  emitJoinRequestReceived(roomId: string, data: unknown) {
    this.server.to(roomId).emit('join_request_received', data);
  }

  emitMemberJoined(roomId: string, data: unknown) {
    this.server.to(roomId).emit('member_joined', data);
  }

  emitJoinRequestRejected(roomId: string, data: unknown) {
    this.server.to(roomId).emit('join_request_rejected', data);
  }

  emitMemberKicked(roomId: string, data: unknown) {
    this.server.to(roomId).emit('member_kicked', data);
  }

  emitRoomDeleted(roomId: string) {
    this.server.to(roomId).emit('room_deleted', { roomId });
  }
}

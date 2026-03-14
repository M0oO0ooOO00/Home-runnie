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
import { CreateMessageDto } from '@/chat/dto/create-message.dto';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MemberRepository } from '@/member/repository';
import { JwtPayload } from '@/auth/types';

interface SocketUser {
  memberId: number;
  nickname: string;
  roomIds: Set<string>;
}

// origin *은 보안에 취약하기 때문에, 나중에 환경변수로 배포된 링크로 변경해야함
@Injectable()
@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  private users: Map<string, SocketUser> = new Map();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly memberRepository: MemberRepository,
  ) {}

  async handleConnection(socket: Socket) {
    try {
      const token = this.extractTokenFromCookie(socket);
      if (!token) {
        socket.disconnect();
        return;
      }

      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const result = await this.memberRepository.findMemberWithProfile(payload.memberId);
      const profile = result[0]?.profile;

      if (!profile) {
        socket.disconnect();
        return;
      }

      this.users.set(socket.id, {
        memberId: payload.memberId,
        nickname: profile.nickname,
        roomIds: new Set<string>(),
      });

      this.logger.log(`client connected: ${profile.nickname} (${socket.id})`);
    } catch {
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    const user = this.users.get(socket.id);
    if (user) {
      const { nickname, roomIds } = user;
      roomIds.forEach((room) => {
        socket.to(room).emit('user_left', {
          nickname,
          message: `${nickname}님이 퇴장하셨습니다.`,
        });
      });
      this.users.delete(socket.id);
    }
    this.logger.log(`client disconnected: ${socket.id}`);
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(@MessageBody() data: JoinRoomDto, @ConnectedSocket() socket: Socket) {
    const user = this.users.get(socket.id);
    if (!user) return;

    const { roomId } = data;
    const { nickname } = user;

    socket.join(roomId);
    user.roomIds.add(roomId);

    this.server.to(roomId).emit('user_joined', {
      nickname,
      message: `${nickname}님이 입장하셨습니다.`,
    });

    this.logger.log(`${nickname} joined room ${roomId}`);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: CreateMessageDto, @ConnectedSocket() socket: Socket) {
    const user = this.users.get(socket.id);
    const { message, roomId } = data;

    if (!user || !user.roomIds.has(roomId)) {
      return;
    }

    const { nickname } = user;

    socket.to(roomId).emit('received_message', {
      nickname,
      message,
      isOwn: false,
    });

    socket.emit('received_message', {
      nickname,
      message,
      isOwn: true,
    });
  }

  private extractTokenFromCookie(socket: Socket): string | null {
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) return null;

    const cookies: Record<string, string> = {};
    cookieHeader.split(';').forEach((pair) => {
      const idx = pair.indexOf('=');
      if (idx > -1) {
        const key = pair.slice(0, idx).trim();
        const value = pair.slice(idx + 1).trim();
        cookies[key] = decodeURIComponent(value);
      }
    });

    return cookies['accessToken'] ?? null;
  }
}

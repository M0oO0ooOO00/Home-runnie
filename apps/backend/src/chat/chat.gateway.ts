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
import { Logger } from '@nestjs/common';

interface UserInfo {
  nickname: string;
  roomId: Set<string>;
}

// origin *은 보안에 취약하기 때문에, 나중에 환경변수로 배포된 링크로 변경해야함
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

  private users: Map<string, UserInfo> = new Map();

  handleConnection(socket: Socket) {
    this.logger.log('client connected', socket.id);
  }

  handleDisconnect(socket: Socket) {
    const userInfo = this.users.get(socket.id);
    if (userInfo) {
      socket.broadcast.emit('user_left', {
        nickname: userInfo.nickname,
        message: `${userInfo.nickname}님이 퇴장하셨습니다.`,
      });
      this.users.delete(socket.id);
    }
    this.logger.log('client disconnected', socket.id);
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(@MessageBody() data: JoinRoomDto, @ConnectedSocket() socket: Socket) {
    const { nickname, roomId } = data;

    // 기존 유저 정보 가져오기 또는 새로 생성
    let userInfo = this.users.get(socket.id);
    if (!userInfo) {
      userInfo = {
        nickname,
        roomId: new Set<string>(),
      };
      this.users.set(socket.id, userInfo);
    }

    socket.join(roomId);

    userInfo.roomId.add(roomId);

    this.server.to(roomId).emit('user_joined', {
      nickname,
      message: `${nickname}님이 입장하셨습니다.`,
    });

    this.logger.log(`${nickname} joined room ${roomId}`);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: CreateMessageDto, @ConnectedSocket() socket: Socket) {
    const userInfo = this.users.get(socket.id);
    const nickname = userInfo?.nickname || '익명';
    const { message, roomId } = data;

    socket.to(roomId).emit('received_message', {
      nickname: nickname,
      message: message,
      isOwn: false,
    });

    socket.emit('received_message', {
      nickname: nickname,
      message: message,
      isOwn: true,
    });
  }
}

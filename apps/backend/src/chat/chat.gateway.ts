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
import { JoinRoomDto } from './dto/room-join.dto';
import { CreateMessageDto } from './dto/create-message.dto';
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
    const nickname = this.users.get(socket.id);
    if (nickname) {
      socket.broadcast.emit('user_left', {
        nickname,
        message: `${nickname}님이 퇴장하셨습니다.`,
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

    // TODO(human): 여기에 실제 room join 로직을 구현하세요
    // Socket.IO의 socket.join()을 사용하여 특정 방에 입장하고,
    // userInfo.roomId Set에 roomId를 추가한 후,
    // 해당 방에만 입장 메시지를 전송하는 로직이 필요합니다

    this.logger.log(`${nickname} joined room ${roomId}`);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: CreateMessageDto, @ConnectedSocket() socket: Socket) {
    const nickname = this.users.get(socket.id) || '익명';

    socket.broadcast.emit('received_message', {
      nickname,
      message: data.message,
      isOwn: false,
    });

    socket.emit('received_message', {
      nickname: '나',
      message: data.message,
      isOwn: true,
    });
  }
}

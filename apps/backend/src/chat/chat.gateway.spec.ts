import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Server, Socket } from 'socket.io';
import { ChatGateway } from './chat.gateway';

type MockSocket = {
  id: string;
  emit: jest.Mock;
  join: jest.Mock;
  to: jest.Mock;
  broadcast: {
    emit: jest.Mock;
  };
};

type MockServer = {
  to: jest.Mock;
};

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let loggerSpy: jest.SpyInstance;
  let mockServer: MockServer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatGateway],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    loggerSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();

    const mockEmit = jest.fn();
    mockServer = {
      to: jest.fn().mockReturnValue({ emit: mockEmit }),
    };
    gateway.server = mockServer as unknown as Server;
  });

  afterEach(() => {
    loggerSpy.mockRestore();
  });

  const createMockSocket = (id: string): MockSocket => {
    const mockTo = jest.fn().mockReturnValue({ emit: jest.fn() });
    return {
      id,
      emit: jest.fn(),
      join: jest.fn(),
      to: mockTo,
      broadcast: { emit: jest.fn() },
    };
  };

  it('gateway가 정상적으로 생성되어야 한다', () => {
    expect(gateway).toBeDefined();
  });

  it('클라이언트 연결시 로그를 출력한다', () => {
    const mockSocket = createMockSocket('test-123');

    gateway.handleConnection(mockSocket as unknown as Socket);

    expect(loggerSpy).toHaveBeenCalledWith('client connected', 'test-123');
  });

  it('사용자가 입장하면 Map에 UserInfo로 저장된다', () => {
    const mockSocket = createMockSocket('user-1');

    expect(gateway['users'].size).toBe(0);

    gateway.handleJoinRoom(
      { nickname: '테스터', roomId: 'room1' },
      mockSocket as unknown as Socket,
    );

    const userInfo = gateway['users'].get('user-1');
    expect(userInfo).toBeDefined();
    expect(userInfo!.nickname).toBe('테스터');
    expect(userInfo!.roomId.has('room1')).toBe(true);
    expect(mockSocket.join).toHaveBeenCalledWith('room1');
  });

  it('입장시 방 전체에 입장 메시지를 보낸다', () => {
    const mockSocket = createMockSocket('user-1');

    gateway.handleJoinRoom(
      { nickname: '테스터', roomId: 'room1' },
      mockSocket as unknown as Socket,
    );

    expect(mockServer.to).toHaveBeenCalledWith('room1');
    const toResult = mockServer.to('room1');
    expect(toResult.emit).toHaveBeenCalledWith('user_joined', {
      nickname: '테스터',
      message: '테스터님이 입장하셨습니다.',
    });
  });

  it('닉네임이 없으면 퇴장 알림을 보내지 않는다', () => {
    const mockSocket = createMockSocket('user-1');

    gateway.handleDisconnect(mockSocket as unknown as Socket);

    expect(mockSocket.broadcast.emit).not.toHaveBeenCalled();
  });

  it('닉네임이 있으면 퇴장 알림을 보낸다', () => {
    const mockSocket = createMockSocket('user-1');

    gateway['users'].set('user-1', {
      nickname: '테스터',
      roomId: new Set(['room1']),
    });

    gateway.handleDisconnect(mockSocket as unknown as Socket);

    expect(mockSocket.broadcast.emit).toHaveBeenCalledWith('user_left', {
      nickname: '테스터',
      message: '테스터님이 퇴장하셨습니다.',
    });
  });

  describe('handleMessage', () => {
    it('나를 제외한 방 사람들에게 isOwn: false로 메시지를 전송한다', () => {
      const mockSocket = createMockSocket('user-1');

      gateway['users'].set('user-1', {
        nickname: '테스터',
        roomId: new Set(['room1']),
      });

      gateway.handleMessage(
        { message: '안녕하세요', roomId: 'room1' },
        mockSocket as unknown as Socket,
      );

      expect(mockSocket.to).toHaveBeenCalledWith('room1');

      const toResult = mockSocket.to('room1');
      expect(toResult.emit).toHaveBeenCalledWith('received_message', {
        nickname: '테스터',
        message: '안녕하세요',
        isOwn: false,
      });
    });

    it('나에게 isOwn: true로 메시지를 전송한다', () => {
      const mockSocket = createMockSocket('user-1');

      gateway['users'].set('user-1', {
        nickname: '테스터',
        roomId: new Set(['room1']),
      });

      gateway.handleMessage(
        { message: '안녕하세요', roomId: 'room1' },
        mockSocket as unknown as Socket,
      );

      expect(mockSocket.emit).toHaveBeenCalledWith('received_message', {
        nickname: '테스터',
        message: '안녕하세요',
        isOwn: true,
      });
    });
  });
});

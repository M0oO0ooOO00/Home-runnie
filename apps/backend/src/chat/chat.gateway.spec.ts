import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Socket } from 'socket.io';
import { ChatGateway } from '@/chat/chat.gateway';

type MockSocket = {
  id: string;
  emit: jest.Mock;
  broadcast: {
    emit: jest.Mock;
  };
};

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let loggerSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatGateway],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    loggerSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
  });

  afterEach(() => {
    loggerSpy.mockRestore();
  });

  it('gateway가 정상적으로 생성되어야 한다', () => {
    expect(gateway).toBeDefined();
  });

  it('클라이언트 연결시 로그를 출력한다', () => {
    const mockSocket: MockSocket = {
      id: 'test-123',
      emit: jest.fn(),
      broadcast: { emit: jest.fn() },
    };

    gateway.handleConnection(mockSocket as unknown as Socket);

    expect(loggerSpy).toHaveBeenCalledWith('client connected', 'test-123');
  });

  it('사용자가 입장하면 Map에 저장된다', () => {
    const mockSocket: MockSocket = {
      id: 'user-1',
      emit: jest.fn(),
      broadcast: { emit: jest.fn() },
    };

    expect(gateway['users'].size).toBe(0);

    gateway.handleJoinRoom({ nickname: '테스터' }, mockSocket as unknown as Socket);

    expect(gateway['users'].get('user-1')).toBe('테스터');
  });

  it('입장시 본인에게 성공 메시지를 보낸다', () => {
    const mockSocket: MockSocket = {
      id: 'user-1',
      emit: jest.fn(),
      broadcast: { emit: jest.fn() },
    };

    gateway.handleJoinRoom({ nickname: '테스터' }, mockSocket as unknown as Socket);

    expect(mockSocket.emit).toHaveBeenCalledWith('join_success', {
      message: '테스터님, 채팅방에 입장하셨습니다.',
    });
  });

  it('닉네임이 없으면 퇴장 알림을 보내지 않는다', () => {
    const mockSocket: MockSocket = {
      id: 'user-1',
      emit: jest.fn(),
      broadcast: { emit: jest.fn() },
    };

    gateway.handleDisconnect(mockSocket as unknown as Socket);

    expect(mockSocket.broadcast.emit).not.toHaveBeenCalled();
  });

  it('닉네임이 있으면 퇴장 알림을 보낸다', () => {
    const mockSocket: MockSocket = {
      id: 'user-1',
      emit: jest.fn(),
      broadcast: { emit: jest.fn() },
    };

    gateway['users'].set('user-1', '테스터');

    gateway.handleDisconnect(mockSocket as unknown as Socket);

    expect(mockSocket.broadcast.emit).toHaveBeenCalledWith('user_left', {
      nickname: '테스터',
      message: '테스터님이 퇴장하셨습니다.',
    });
  });
});

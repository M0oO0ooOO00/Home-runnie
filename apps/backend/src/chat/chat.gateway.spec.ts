import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatGateway],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
  });
  it('gateway가 정상적으로 생성되어야 한다', () => {
    expect(gateway).toBeDefined();
  });

  it('클라이언트 연결시 로그를 출력한다', () => {
    const mockSocket = {
      id: 'test-123',
      emit: jest.fn(),
      broadcast: { emit: jest.fn() },
    } as any;

    const consoleSpy = jest.spyOn(console, 'log');

    gateway.handleConnection(mockSocket);

    expect(consoleSpy).toHaveBeenCalledWith('client connected', 'test-123');

    consoleSpy.mockRestore();
  });
  it('사용자가 입장하면 Map에 저장된다', () => {
    const mockSocket = {
      id: 'user-1',
      emit: jest.fn(),
      broadcast: { emit: jest.fn() },
    } as any;
    expect(gateway['users'].size).toBe(0);

    gateway.handleJoinRoom({ nickname: '테스터' }, mockSocket);

    expect(gateway['users'].get('user-1')).toBe('테스터');
  });
  it('입장시 본인에게 성공 메시지를 보낸다', () => {
    const mockSocket = {
      id: 'user-1',
      emit: jest.fn(),
      broadcast: { emit: jest.fn() },
    } as any;

    gateway.handleJoinRoom({ nickname: '테스터' }, mockSocket);

    expect(mockSocket.emit).toHaveBeenCalledWith('join_success', {
      message: '테스터님, 채팅방에 입장하셨습니다.',
    });
  });
  it('닉네임이 없으면 퇴장 알림을 보내지 않는다', () => {
    const mockSocket = {
      id: 'user-1',
      broadcast: { emit: jest.fn() },
    } as any;

    gateway.handleDisconnect(mockSocket);

    expect(mockSocket.broadcast.emit).not.toHaveBeenCalled();
  });

  it('닉네임이 있으면 퇴장 알림을 보낸다', () => {
    const mockSocket = {
      id: 'user-1',
      broadcast: { emit: jest.fn() },
    } as any;

    gateway['users'].set('user-1', '테스터');

    gateway.handleDisconnect(mockSocket);

    expect(mockSocket.broadcast.emit).toHaveBeenCalledWith('user_left', {
      nickname: '테스터',
      message: '테스터님이 퇴장하셨습니다.',
    });
  });
});

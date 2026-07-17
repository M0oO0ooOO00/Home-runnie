import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Server, Socket } from 'socket.io';
import { ChatGateway } from './chat.gateway';
import { MemberRepository } from '@/member/repository';
import { ChatRepository } from '@/chat/repository';
import { WsSocketUser } from './ws-jwt.guard';
import { UploadService } from '@/upload';
import { ChatMessageType } from '@homerunnie/shared';

type MockSocket = {
  id: string;
  data: { user?: WsSocketUser };
  emit: jest.Mock;
  join: jest.Mock;
  to: jest.Mock;
  disconnect: jest.Mock;
  handshake: { headers: { cookie?: string } };
};

const createMockSocket = (id: string, user?: WsSocketUser): MockSocket => ({
  id,
  data: { user },
  emit: jest.fn(),
  join: jest.fn(),
  to: jest.fn().mockReturnValue({ emit: jest.fn() }),
  disconnect: jest.fn(),
  handshake: { headers: {} },
});

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let loggerSpy: jest.SpyInstance;
  let mockServer: { to: jest.Mock };
  let mockJwtService: { verifyAsync: jest.Mock };
  let mockMemberRepository: { findMemberWithProfile: jest.Mock };
  let mockChatRepository: {
    findMessagesByRoomId: jest.Mock;
    findChatRoomMember: jest.Mock;
    saveMessage: jest.Mock;
    saveImageMessage: jest.Mock;
    updateChatRoomUpdatedAt: jest.Mock;
    updateLastReadAt: jest.Mock;
  };
  let mockUploadService: { isValidChatImageMetadata: jest.Mock };

  beforeEach(async () => {
    mockJwtService = { verifyAsync: jest.fn() };
    mockMemberRepository = { findMemberWithProfile: jest.fn() };
    mockChatRepository = {
      findMessagesByRoomId: jest.fn().mockResolvedValue([]),
      findChatRoomMember: jest.fn().mockResolvedValue({ memberId: 1 }),
      saveMessage: jest.fn().mockImplementation(async (_roomId, _memberId, content) => ({
        id: 1,
        content,
        messageType: 'TEXT',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
      })),
      saveImageMessage: jest.fn().mockResolvedValue({
        message: {
          id: 2,
          content: '사진입니다',
          messageType: ChatMessageType.IMAGE,
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
        },
        images: [
          {
            id: 10,
            imageUrl: 'https://example.com/image.jpg',
            mimeType: 'image/jpeg',
            fileSize: 100,
            imageOrder: 0,
          },
        ],
      }),
      updateChatRoomUpdatedAt: jest.fn().mockResolvedValue(undefined),
      updateLastReadAt: jest.fn().mockResolvedValue(undefined),
    };
    mockUploadService = { isValidChatImageMetadata: jest.fn().mockReturnValue(true) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: { get: jest.fn().mockReturnValue('test-secret') } },
        { provide: MemberRepository, useValue: mockMemberRepository },
        { provide: ChatRepository, useValue: mockChatRepository },
        { provide: UploadService, useValue: mockUploadService },
      ],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    loggerSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();

    const mockEmit = jest.fn();
    mockServer = { to: jest.fn().mockReturnValue({ emit: mockEmit }) };
    gateway.server = mockServer as unknown as Server;
  });

  afterEach(() => {
    loggerSpy.mockRestore();
  });

  it('gateway가 정상적으로 생성되어야 한다', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('토큰이 없으면 disconnect한다', async () => {
      const socket = createMockSocket('test-1');
      await gateway.handleConnection(socket as unknown as Socket);
      expect(socket.disconnect).toHaveBeenCalled();
    });

    it('JWT 검증 실패 시 disconnect한다', async () => {
      const socket = createMockSocket('test-1');
      socket.handshake.headers.cookie = 'accessToken=invalid';
      mockJwtService.verifyAsync.mockRejectedValue(new Error('invalid token'));

      await gateway.handleConnection(socket as unknown as Socket);
      expect(socket.disconnect).toHaveBeenCalled();
    });

    it('프로필이 없으면 disconnect한다', async () => {
      const socket = createMockSocket('test-1');
      socket.handshake.headers.cookie = 'accessToken=validtoken';
      mockJwtService.verifyAsync.mockResolvedValue({ memberId: 1 });
      mockMemberRepository.findMemberWithProfile.mockResolvedValue([]);

      await gateway.handleConnection(socket as unknown as Socket);
      expect(socket.disconnect).toHaveBeenCalled();
    });

    it('인증 성공 시 socket.data.user를 설정하고 authenticated를 emit한다', async () => {
      const socket = createMockSocket('test-1');
      socket.handshake.headers.cookie = 'accessToken=validtoken';
      mockJwtService.verifyAsync.mockResolvedValue({ memberId: 1 });
      mockMemberRepository.findMemberWithProfile.mockResolvedValue([
        { profile: { nickname: '테스터' } },
      ]);

      await gateway.handleConnection(socket as unknown as Socket);

      expect(socket.data.user).toMatchObject({ memberId: 1, nickname: '테스터' });
      expect(socket.emit).toHaveBeenCalledWith('authenticated');
    });
  });

  describe('handleDisconnect', () => {
    it('socket.data.user가 없으면 퇴장 알림을 보내지 않는다', () => {
      const socket = createMockSocket('user-1');
      gateway.handleDisconnect(socket as unknown as Socket);
      expect(socket.to).not.toHaveBeenCalled();
    });

    it('socket.data.user가 있어도 현재는 퇴장 알림을 보내지 않는다', () => {
      const user: WsSocketUser = {
        memberId: 1,
        nickname: '테스터',
        supportTeam: null,
        roomIds: new Set(['room1']),
      };
      const socket = createMockSocket('user-1', user);

      gateway.handleDisconnect(socket as unknown as Socket);

      expect(socket.to).not.toHaveBeenCalled();
    });
  });

  describe('handleJoinRoom', () => {
    it('방에 join하고 message_history를 emit한다', async () => {
      const user: WsSocketUser = {
        memberId: 1,
        nickname: '테스터',
        supportTeam: null,
        roomIds: new Set(),
      };
      const socket = createMockSocket('user-1', user);
      mockChatRepository.findMessagesByRoomId.mockResolvedValue([]);

      await gateway.handleJoinRoom(user, { roomId: '1' }, socket as unknown as Socket);

      expect(socket.join).toHaveBeenCalledWith('1');
      expect(user.roomIds.has('1')).toBe(true);
      expect(socket.emit).toHaveBeenCalledWith('message_history', []);
    });

    it('채팅방 멤버가 아니면 방에 입장하지 않는다', async () => {
      const user: WsSocketUser = {
        memberId: 1,
        nickname: '테스터',
        supportTeam: null,
        roomIds: new Set(),
      };
      const socket = createMockSocket('user-1', user);
      mockChatRepository.findMessagesByRoomId.mockResolvedValue([]);
      mockChatRepository.findChatRoomMember.mockResolvedValue(null);

      await gateway.handleJoinRoom(user, { roomId: '1' }, socket as unknown as Socket);

      expect(socket.join).not.toHaveBeenCalled();
      expect(socket.emit).not.toHaveBeenCalled();
    });
  });

  describe('handleMessage', () => {
    it('참여하지 않은 방이면 메시지를 전송하지 않는다', async () => {
      const user: WsSocketUser = {
        memberId: 1,
        nickname: '테스터',
        supportTeam: null,
        roomIds: new Set(),
      };
      const socket = createMockSocket('user-1', user);

      await gateway.handleMessage(
        user,
        { message: '안녕', roomId: '1' },
        socket as unknown as Socket,
      );

      expect(socket.to).not.toHaveBeenCalled();
      expect(socket.emit).not.toHaveBeenCalled();
    });

    it('나를 제외한 방 사람들에게 isOwn: false로 메시지를 전송한다', async () => {
      const user: WsSocketUser = {
        memberId: 1,
        nickname: '테스터',
        supportTeam: null,
        roomIds: new Set(['1']),
      };
      const socket = createMockSocket('user-1', user);

      await gateway.handleMessage(
        user,
        { message: '안녕하세요', roomId: '1' },
        socket as unknown as Socket,
      );

      expect(socket.to).toHaveBeenCalledWith('1');
      const toResult = socket.to('1');
      expect(toResult.emit).toHaveBeenCalledWith(
        'received_message',
        expect.objectContaining({
          id: 1,
          nickname: '테스터',
          message: '안녕하세요',
          type: 'TEXT',
          attachments: [],
          isOwn: false,
        }),
      );
    });

    it('나에게 isOwn: true로 메시지를 전송한다', async () => {
      const user: WsSocketUser = {
        memberId: 1,
        nickname: '테스터',
        supportTeam: null,
        roomIds: new Set(['1']),
      };
      const socket = createMockSocket('user-1', user);

      await gateway.handleMessage(
        user,
        { message: '안녕하세요', roomId: '1' },
        socket as unknown as Socket,
      );

      expect(socket.emit).toHaveBeenCalledWith(
        'received_message',
        expect.objectContaining({
          id: 1,
          nickname: '테스터',
          message: '안녕하세요',
          type: 'TEXT',
          attachments: [],
          isOwn: true,
        }),
      );
    });

    it('이미지 메시지를 저장하고 첨부파일 정보를 전송한다', async () => {
      const user: WsSocketUser = {
        memberId: 1,
        nickname: '테스터',
        supportTeam: null,
        roomIds: new Set(['1']),
      };
      const socket = createMockSocket('user-1', user);

      await gateway.handleMessage(
        user,
        {
          roomId: '1',
          type: ChatMessageType.IMAGE,
          message: '사진입니다',
          attachments: [
            {
              objectKey: 'chat/1/1/image.jpg',
              imageUrl: 'https://example.com/image.jpg',
              mimeType: 'image/jpeg',
              fileSize: 100,
              imageOrder: 0,
            },
          ],
        },
        socket as unknown as Socket,
      );

      expect(mockChatRepository.saveImageMessage).toHaveBeenCalledWith(
        1,
        1,
        '사진입니다',
        expect.any(Array),
      );
      expect(socket.emit).toHaveBeenCalledWith(
        'received_message',
        expect.objectContaining({
          id: 2,
          type: ChatMessageType.IMAGE,
          message: '사진입니다',
          attachments: [
            expect.objectContaining({
              id: 10,
              imageUrl: 'https://example.com/image.jpg',
            }),
          ],
          isOwn: true,
        }),
      );
    });
  });
});

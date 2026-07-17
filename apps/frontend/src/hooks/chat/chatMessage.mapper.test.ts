import { ChatMessageType } from '@homerunnie/shared';
import {
  mapHistoryMessageToChatMessage,
  mapReceivedMessageToChatMessage,
} from './chatMessage.mapper';

const attachment = {
  id: 10,
  imageUrl: 'https://example.com/chat-image.png',
  mimeType: 'image/png',
  fileSize: 100,
  imageOrder: 0,
};

describe('chat message mapper', () => {
  it('maps image history messages with their attachments', () => {
    const result = mapHistoryMessageToChatMessage({
      id: 1,
      message: '',
      type: ChatMessageType.IMAGE,
      attachments: [attachment],
      isOwn: true,
      nickname: 'me',
      supportTeam: null,
      createdAt: '2026-07-17T00:00:00.000Z',
    });

    expect(result).toMatchObject({
      id: 1,
      type: ChatMessageType.IMAGE,
      attachments: [attachment],
      sender: 'me',
    });
  });

  it('uses the server message id for received messages', () => {
    const result = mapReceivedMessageToChatMessage({
      id: 20,
      nickname: 'other',
      message: '사진입니다',
      type: ChatMessageType.IMAGE,
      attachments: [attachment],
      isOwn: false,
      roomId: '1',
    });

    expect(result).toMatchObject({
      id: 20,
      text: '사진입니다',
      type: ChatMessageType.IMAGE,
      attachments: [attachment],
      sender: 'other',
    });
  });
});

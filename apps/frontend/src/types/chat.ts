import { ChatMessageType } from '@homerunnie/shared';

export interface ChatImageAttachment {
  id: number;
  imageUrl: string;
  mimeType: string;
  fileSize: number;
  imageOrder: number;
}

export type ChatImageUploadMetadata = Omit<ChatImageAttachment, 'id'> & {
  objectKey: string;
};

export interface ChatHistoryMessagePayload {
  id: number;
  message: string;
  type?: ChatMessageType;
  attachments?: ChatImageAttachment[];
  isOwn: boolean;
  nickname: string;
  supportTeam: string | null;
  createdAt?: string;
}

export interface ChatReceivedMessagePayload {
  id?: number;
  nickname: string;
  message: string;
  type?: ChatMessageType;
  attachments?: ChatImageAttachment[];
  isOwn: boolean;
  supportTeam?: string | null;
  roomId?: string;
  createdAt?: string;
}

export interface ChatMessage {
  id: number;
  text: string;
  type: ChatMessageType;
  attachments: ChatImageAttachment[];
  sender: 'me' | 'other' | 'system';
  nickname: string;
  supportTeam: string | null;
  createdAt: string;
}

import type {
  ChatHistoryMessagePayload,
  ChatMessage,
  ChatReceivedMessagePayload,
} from '@/types/chat';
import { ChatMessageType } from '@homerunnie/shared';

const SYSTEM_PREFIX = '[SYSTEM]';
let tempIdCounter = 0;

const getCreatedAt = (createdAt?: string) => createdAt ?? new Date().toISOString();

const getMessageType = (
  type: ChatMessageType | undefined,
  attachments: ChatMessage['attachments'],
) => type ?? (attachments.length > 0 ? ChatMessageType.IMAGE : ChatMessageType.TEXT);

export const isSystemMessage = (message: string) => message.startsWith(SYSTEM_PREFIX);

export const stripSystemPrefix = (message: string) =>
  isSystemMessage(message) ? message.slice(SYSTEM_PREFIX.length) : message;

export const mapHistoryMessageToChatMessage = (message: ChatHistoryMessagePayload): ChatMessage => {
  const system = isSystemMessage(message.message);
  const attachments = message.attachments ?? [];

  return {
    id: message.id,
    text: stripSystemPrefix(message.message),
    type: getMessageType(message.type, attachments),
    attachments,
    sender: system ? 'system' : message.isOwn ? 'me' : 'other',
    nickname: system || message.isOwn ? '' : message.nickname,
    supportTeam: system ? null : message.supportTeam,
    createdAt: getCreatedAt(message.createdAt),
  };
};

export const mapReceivedMessageToChatMessage = (
  message: ChatReceivedMessagePayload,
): ChatMessage => {
  const system = isSystemMessage(message.message);
  const attachments = message.attachments ?? [];

  return {
    id: message.id ?? Date.now() + (tempIdCounter++ % 1000),
    text: stripSystemPrefix(message.message),
    type: getMessageType(message.type, attachments),
    attachments,
    sender: system ? 'system' : message.isOwn ? 'me' : 'other',
    nickname: system ? '' : message.nickname,
    supportTeam: system ? null : (message.supportTeam ?? null),
    createdAt: getCreatedAt(message.createdAt),
  };
};

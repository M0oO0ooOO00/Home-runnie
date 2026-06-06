import type {
  ChatHistoryMessagePayload,
  ChatMessage,
  ChatReceivedMessagePayload,
} from '@/types/chat';

const SYSTEM_PREFIX = '[SYSTEM]';
let tempIdCounter = 0;

const getCreatedAt = (createdAt?: string) => createdAt ?? new Date().toISOString();

export const isSystemMessage = (message: string) => message.startsWith(SYSTEM_PREFIX);

export const stripSystemPrefix = (message: string) =>
  isSystemMessage(message) ? message.slice(SYSTEM_PREFIX.length) : message;

export const mapHistoryMessageToChatMessage = (message: ChatHistoryMessagePayload): ChatMessage => {
  const system = isSystemMessage(message.message);

  return {
    id: message.id,
    text: stripSystemPrefix(message.message),
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

  return {
    id: Date.now() + (tempIdCounter++ % 1000),
    text: stripSystemPrefix(message.message),
    sender: system ? 'system' : message.isOwn ? 'me' : 'other',
    nickname: system ? '' : message.nickname,
    supportTeam: system ? null : (message.supportTeam ?? null),
    createdAt: getCreatedAt(message.createdAt),
  };
};

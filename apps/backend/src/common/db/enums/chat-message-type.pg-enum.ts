import { pgEnum } from 'drizzle-orm/pg-core';
import { ChatMessageType } from '@homerunnie/shared';

export const chatMessageTypePgEnum = pgEnum(
  'chat_message_type',
  Object.values(ChatMessageType) as [string, ...string[]],
);

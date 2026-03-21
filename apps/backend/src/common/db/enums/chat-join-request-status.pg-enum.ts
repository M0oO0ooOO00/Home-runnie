import { pgEnum } from 'drizzle-orm/pg-core';
import { ChatJoinRequestStatus } from '@homerunnie/shared';

export const chatJoinRequestStatusPgEnum = pgEnum(
  'chat_join_request_status',
  Object.values(ChatJoinRequestStatus) as [string, ...string[]],
);

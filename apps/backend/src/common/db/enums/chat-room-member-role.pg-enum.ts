import { pgEnum } from 'drizzle-orm/pg-core';
import { ChatRoomMemberRole } from '@homerunnie/shared';

export const chatRoomMemberRolePgEnum = pgEnum(
  'chat_room_member_role',
  Object.values(ChatRoomMemberRole) as [string, ...string[]],
);

import { pgEnum } from 'drizzle-orm/pg-core';
import { ChatRoomMemberRoleEnum } from '@/common/enums';

export const chatRoomMemberRolePgEnum = pgEnum(
  'chat_room_member_role',
  Object.values(ChatRoomMemberRoleEnum) as [string, ...string[]],
);

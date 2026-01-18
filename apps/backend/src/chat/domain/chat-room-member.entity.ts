import { integer, pgTable, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { baseColumns } from '@/common/db/base.entity';
import { chatRoomMemberRolePgEnum } from '@/common/db/enums';
import { ChatRoom } from '@/chat/domain/chat-room.entity';
import { Member } from '@/member/domain';

export { chatRoomMemberRolePgEnum };

export const ChatRoomMember = pgTable(
  'chat_room_member',
  {
    ...baseColumns,
    role: chatRoomMemberRolePgEnum('role').notNull(),
    chatRoomId: integer('chat_room_id')
      .notNull()
      .references(() => ChatRoom.id),
    memberId: integer('member_id')
      .notNull()
      .references(() => Member.id),
  },
  (table) => ({
    uniqueMemberChatRoom: unique().on(table.chatRoomId, table.memberId),
  }),
);

export const chatRoomMemberRelations = relations(ChatRoomMember, ({ one }) => ({
  chatRoom: one(ChatRoom, {
    fields: [ChatRoomMember.chatRoomId],
    references: [ChatRoom.id],
  }),
  member: one(Member, {
    fields: [ChatRoomMember.memberId],
    references: [Member.id],
  }),
}));

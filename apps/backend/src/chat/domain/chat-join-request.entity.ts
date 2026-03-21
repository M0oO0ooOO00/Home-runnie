import { integer, pgTable, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { baseColumns } from '@/common/db/base.entity';
import { chatJoinRequestStatusPgEnum } from '@/common/db/enums';
import { ChatRoom } from '@/chat/domain/chat-room.entity';
import { Member } from '@/member/domain';

export { chatJoinRequestStatusPgEnum };

export const ChatJoinRequest = pgTable(
  'chat_join_request',
  {
    ...baseColumns,
    status: chatJoinRequestStatusPgEnum('status').notNull(),
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

export const chatJoinRequestRelations = relations(ChatJoinRequest, ({ one }) => ({
  chatRoom: one(ChatRoom, {
    fields: [ChatJoinRequest.chatRoomId],
    references: [ChatRoom.id],
  }),
  member: one(Member, {
    fields: [ChatJoinRequest.memberId],
    references: [Member.id],
  }),
}));

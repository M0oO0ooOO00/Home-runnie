import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { baseColumns } from '@/common/db/base.entity';
import { ChatRoom } from '@/chat/domain/chat-room.entity';
import { Member } from '@/member/domain';
import { chatMessageTypePgEnum } from '@/common/db/enums';
import { ChatMessageImage } from '@/chat/domain/chat-message-image.entity';

export { chatMessageTypePgEnum };

export const ChatMessage = pgTable('chat_message', {
  ...baseColumns,
  content: text('content'),
  messageType: chatMessageTypePgEnum('message_type').notNull().default('TEXT'),
  chatRoomId: integer('chat_room_id')
    .notNull()
    .references(() => ChatRoom.id),
  senderId: integer('sender_id')
    .notNull()
    .references(() => Member.id),
});

export const chatMessageRelations = relations(ChatMessage, ({ one, many }) => ({
  chatRoom: one(ChatRoom, {
    fields: [ChatMessage.chatRoomId],
    references: [ChatRoom.id],
  }),
  sender: one(Member, {
    fields: [ChatMessage.senderId],
    references: [Member.id],
  }),
  images: many(ChatMessageImage),
}));

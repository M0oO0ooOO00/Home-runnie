import { integer, pgTable } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { baseColumns } from '@/common/db/base.entity';
import { Post } from '@/post/domain';
import { ChatMessage } from '@/chat/domain/chat-message.entity';
import { ChatRoomMember } from '@/chat/domain/chat-room-member.entity';

export const ChatRoom = pgTable('chat_room', {
  ...baseColumns,
  postId: integer('post_id')
    .notNull()
    .references(() => Post.id),
});

export const chatRoomRelations = relations(ChatRoom, ({ one, many }) => ({
  post: one(Post, {
    fields: [ChatRoom.postId],
    references: [Post.id],
  }),
  messages: many(ChatMessage),
  members: many(ChatRoomMember),
}));

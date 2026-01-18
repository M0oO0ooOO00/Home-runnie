import { integer, pgTable } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { baseColumns } from '@/common/db/base.entity';
import { Post } from '@/post/domain';
import { ChatMessage } from '@/chat/domain/chat-message.entity';
import { ChatRoomMember } from '@/chat/domain/chat-room-member.entity';

export const ChatRoom = pgTable('chat_room', {
  ...baseColumns,
  postId: integer('post_id').notNull(),
  // TODO: Post 관련 기능 구현 후 외래 키 제약 조건 추가
  // .references(() => Post.id),
});

export const chatRoomRelations = relations(ChatRoom, ({ one, many }) => ({
  post: one(Post, {
    fields: [ChatRoom.postId],
    references: [Post.id],
  }),
  messages: many(ChatMessage),
  members: many(ChatRoomMember),
}));

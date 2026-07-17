import { index, integer, pgTable, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { baseColumns } from '@/common/db/base.entity';
import { ChatMessage } from '@/chat/domain/chat-message.entity';

export const ChatMessageImage = pgTable(
  'chat_message_image',
  {
    ...baseColumns,
    chatMessageId: integer('chat_message_id')
      .notNull()
      .references(() => ChatMessage.id),
    objectKey: text('object_key').notNull(),
    imageUrl: text('image_url').notNull(),
    mimeType: text('mime_type').notNull(),
    fileSize: integer('file_size').notNull(),
    imageOrder: integer('image_order').notNull().default(0),
  },
  (table) => ({
    chatMessageIdIdx: index('chat_message_image_chat_message_id_idx').on(table.chatMessageId),
  }),
);

export const chatMessageImageRelations = relations(ChatMessageImage, ({ one }) => ({
  chatMessage: one(ChatMessage, {
    fields: [ChatMessageImage.chatMessageId],
    references: [ChatMessage.id],
  }),
}));

import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { baseColumns } from '@/common';
import { Post } from '@/post/shared/domain/post.entity';
import { relations } from 'drizzle-orm';

export const FeedDetail = pgTable('feed_detail', {
  ...baseColumns,
  content: text('content').notNull(),
  postId: integer('post_id')
    .notNull()
    .unique()
    .references(() => Post.id),
});

export const feedDetailRelations = relations(FeedDetail, ({ one }) => ({
  post: one(Post, {
    fields: [FeedDetail.postId],
    references: [Post.id],
  }),
}));

import { type AnyPgColumn, index, integer, pgTable, text } from 'drizzle-orm/pg-core';
import { baseColumns } from '@/common';
import { postStatusPgEnum } from '@/common';
import { Member } from '@/member/domain';
import { Post } from '@/post/shared/domain';
import { relations } from 'drizzle-orm';

export { postStatusPgEnum };
export const Comment = pgTable(
  'comment',
  {
    ...baseColumns,
    content: text('content').notNull(),
    postStatus: postStatusPgEnum('post_status').notNull(),
    authorId: integer('author_id')
      .notNull()
      .references(() => Member.id),
    postId: integer('post_id')
      .notNull()
      .references(() => Post.id),
    parentId: integer('parent_id').references((): AnyPgColumn => Comment.id),
  },
  (table) => [index('comment_parent_id_idx').on(table.parentId)],
);

export const commentRelations = relations(Comment, ({ one, many }) => ({
  author: one(Member, {
    fields: [Comment.authorId],
    references: [Member.id],
  }),
  post: one(Post, {
    fields: [Comment.postId],
    references: [Post.id],
  }),
  parent: one(Comment, {
    fields: [Comment.parentId],
    references: [Comment.id],
    relationName: 'commentReplies',
  }),
  replies: many(Comment, {
    relationName: 'commentReplies',
  }),
}));

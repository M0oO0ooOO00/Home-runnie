import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { baseColumns } from '@/common';
import { Member } from '@/member/domain';
import { postTypePgEnum, postStatusPgEnum } from '@/common';

export { postStatusPgEnum, postTypePgEnum };

export const Post = pgTable('post', {
  ...baseColumns,
  title: text('title').notNull(),
  post_type: postTypePgEnum('post_type').notNull(),
  postStatus: postStatusPgEnum('post_status').notNull(),
  authorId: integer('author_id')
    .notNull()
    .references(() => Member.id),
});

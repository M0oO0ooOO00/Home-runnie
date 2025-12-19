import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { baseColumns } from '@/common/index.js';
import { Member } from '@/member/domain/index.js';
import { relations } from 'drizzle-orm';
import { TipsDetail } from '@/post/domain/tips-detail.entity.js';
import { RecruitmentDetail } from '@/post/domain/recruitment-detail.entity.js';
import { PostImage } from '@/post/domain/post-image.entity.js';
import { Scrap } from '@/scrap/domain/index.js';
import { Comment } from '@/comment/domain/index.js';
import { postTypePgEnum, postStatusPgEnum } from '@/common/index.js';

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

export const postRelations = relations(Post, ({ one, many }) => ({
    author: one(Member, {
        fields: [Post.authorId],
        references: [Member.id],
    }),
    recruitmentDetail: one(RecruitmentDetail),
    tipsDetail: one(TipsDetail),
    postImage: many(PostImage),
    scrap: many(Scrap),
    comment: many(Comment),
}));

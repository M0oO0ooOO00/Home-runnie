import { relations } from 'drizzle-orm';
import { Post } from '@/post/shared/domain';
import { Member } from '@/member/domain';
import { TipsDetail } from '@/post/tips/domain';
import { RecruitmentDetail } from '@/post/recruitment/domain';
import { FeedDetail } from '@/post/feed/domain';
import { PostImage } from '@/post/shared/domain/post-image.entity';
import { Scrap } from '@/scrap/domain';
import { Comment } from '@/comment/domain';

export const postRelations = relations(Post, ({ one, many }) => ({
  author: one(Member, {
    fields: [Post.authorId],
    references: [Member.id],
  }),
  recruitmentDetail: one(RecruitmentDetail),
  tipsDetail: one(TipsDetail),
  feedDetail: one(FeedDetail),
  postImage: many(PostImage),
  scrap: many(Scrap),
  comment: many(Comment),
}));

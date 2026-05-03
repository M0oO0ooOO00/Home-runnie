import { Inject, Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { and, eq } from 'drizzle-orm';
import { Post, PostImage } from '@/post/shared/domain';
import { FeedDetail } from '@/post/feed/domain';
import { Member } from '@/member/domain';
import { Profile } from '@/member/domain/profile.entity';
import { PostType } from '@homerunnie/shared';
import { PostStatusEnum } from '@/common/enums/post-status.enum';
import { DATABASE_CONNECTION } from '@/common';

export interface FeedPostQueryResult {
  id: number;
  authorId: number;
  authorNickname: string | null;
  supportTeam: string | null;
  content: string;
  images: string[];
  createdAt: Date;
}

@Injectable()
export class FeedRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async createFeedPost(authorId: number, content: string, images: string[]) {
    const title = content.slice(0, 50);

    const [post] = await this.db
      .insert(Post)
      .values({
        title,
        post_type: PostType.FEED,
        postStatus: PostStatusEnum.ACTIVE,
        authorId,
      })
      .returning();

    if (!post) {
      throw new Error('FEED 게시글 생성 실패');
    }

    await this.db.insert(FeedDetail).values({
      postId: post.id,
      content,
    });

    if (images.length > 0) {
      await this.db.insert(PostImage).values(
        images.map((imageUrl, idx) => ({
          postId: post.id,
          imageUrl,
          imageOrder: idx,
        })),
      );
    }

    return post;
  }

  async findFeedPostById(postId: number): Promise<FeedPostQueryResult | null> {
    const [base] = await this.db
      .select({
        id: Post.id,
        authorId: Post.authorId,
        authorNickname: Profile.nickname,
        supportTeam: Profile.supportTeam,
        content: FeedDetail.content,
        createdAt: Post.createdAt,
      })
      .from(Post)
      .innerJoin(FeedDetail, eq(Post.id, FeedDetail.postId))
      .innerJoin(Member, eq(Post.authorId, Member.id))
      .leftJoin(Profile, eq(Profile.memberId, Member.id))
      .where(and(eq(Post.id, postId), eq(Post.post_type, PostType.FEED), eq(Post.deleted, false)));

    if (!base) return null;

    const imageRows = await this.db
      .select({
        imageUrl: PostImage.imageUrl,
        imageOrder: PostImage.imageOrder,
      })
      .from(PostImage)
      .where(eq(PostImage.postId, postId))
      .orderBy(PostImage.imageOrder);

    return {
      id: base.id,
      authorId: base.authorId,
      authorNickname: base.authorNickname,
      supportTeam: base.supportTeam,
      content: base.content,
      images: imageRows.map((row) => row.imageUrl),
      createdAt: base.createdAt,
    };
  }
}

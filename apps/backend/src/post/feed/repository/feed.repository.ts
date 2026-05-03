import { Inject, Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { and, desc, eq, inArray, lt } from 'drizzle-orm';
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

  async findFeedPosts(cursorId: number | null, limit: number): Promise<FeedPostQueryResult[]> {
    const conditions = [eq(Post.post_type, PostType.FEED), eq(Post.deleted, false)];
    if (cursorId !== null) {
      conditions.push(lt(Post.id, cursorId));
    }

    const baseRows = await this.db
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
      .where(and(...conditions))
      .orderBy(desc(Post.id))
      .limit(limit);

    if (baseRows.length === 0) return [];

    const postIds = baseRows.map((r) => r.id);
    const imageRows = await this.db
      .select({
        postId: PostImage.postId,
        imageUrl: PostImage.imageUrl,
        imageOrder: PostImage.imageOrder,
      })
      .from(PostImage)
      .where(inArray(PostImage.postId, postIds))
      .orderBy(PostImage.imageOrder);

    const imagesByPostId = imageRows.reduce<Record<number, string[]>>((acc, row) => {
      if (!acc[row.postId]) acc[row.postId] = [];
      acc[row.postId].push(row.imageUrl);
      return acc;
    }, {});

    return baseRows.map((row) => ({
      id: row.id,
      authorId: row.authorId,
      authorNickname: row.authorNickname,
      supportTeam: row.supportTeam,
      content: row.content,
      images: imagesByPostId[row.id] ?? [],
      createdAt: row.createdAt,
    }));
  }
}

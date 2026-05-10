import { Inject, Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { and, asc, count, eq, inArray } from 'drizzle-orm';
import { Comment } from '@/comment/domain';
import { Member } from '@/member/domain';
import { Profile } from '@/member/domain/profile.entity';
import { Post } from '@/post/shared/domain';
import { PostType } from '@homerunnie/shared';
import { PostStatusEnum } from '@/common/enums/post-status.enum';
import { DATABASE_CONNECTION } from '@/common';

export interface FeedCommentQueryResult {
  id: number;
  authorId: number;
  authorNickname: string | null;
  supportTeam: string | null;
  content: string;
  parentId: number | null;
  createdAt: Date;
}

@Injectable()
export class FeedCommentRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async createComment(authorId: number, postId: number, content: string, parentId: number | null) {
    const [comment] = await this.db
      .insert(Comment)
      .values({
        authorId,
        postId,
        content,
        postStatus: PostStatusEnum.ACTIVE,
        parentId,
      })
      .returning();
    return comment;
  }

  async findCommentById(commentId: number): Promise<{
    id: number;
    authorId: number;
    postId: number;
    parentId: number | null;
    deleted: boolean | null;
  } | null> {
    const [row] = await this.db
      .select({
        id: Comment.id,
        authorId: Comment.authorId,
        postId: Comment.postId,
        parentId: Comment.parentId,
        deleted: Comment.deleted,
      })
      .from(Comment)
      .where(eq(Comment.id, commentId))
      .limit(1);
    return row ?? null;
  }

  async findFeedCommentJoined(commentId: number): Promise<FeedCommentQueryResult | null> {
    const [row] = await this.db
      .select({
        id: Comment.id,
        authorId: Comment.authorId,
        authorNickname: Profile.nickname,
        supportTeam: Profile.supportTeam,
        content: Comment.content,
        parentId: Comment.parentId,
        createdAt: Comment.createdAt,
      })
      .from(Comment)
      .innerJoin(Member, eq(Comment.authorId, Member.id))
      .leftJoin(Profile, eq(Profile.memberId, Member.id))
      .where(and(eq(Comment.id, commentId), eq(Comment.deleted, false)))
      .limit(1);
    return row ?? null;
  }

  async findCommentsByPostId(postId: number): Promise<FeedCommentQueryResult[]> {
    const rows = await this.db
      .select({
        id: Comment.id,
        authorId: Comment.authorId,
        authorNickname: Profile.nickname,
        supportTeam: Profile.supportTeam,
        content: Comment.content,
        parentId: Comment.parentId,
        createdAt: Comment.createdAt,
      })
      .from(Comment)
      .innerJoin(Member, eq(Comment.authorId, Member.id))
      .leftJoin(Profile, eq(Profile.memberId, Member.id))
      .where(and(eq(Comment.postId, postId), eq(Comment.deleted, false)))
      .orderBy(asc(Comment.createdAt));
    return rows;
  }

  async assertPostIsFeed(postId: number): Promise<boolean> {
    const [row] = await this.db
      .select({ id: Post.id })
      .from(Post)
      .where(and(eq(Post.id, postId), eq(Post.post_type, PostType.FEED), eq(Post.deleted, false)))
      .limit(1);
    return Boolean(row);
  }

  async softDeleteComment(commentId: number) {
    await this.db
      .update(Comment)
      .set({ deleted: true, updatedAt: new Date() })
      .where(eq(Comment.id, commentId));
  }

  async updateCommentContent(commentId: number, content: string) {
    await this.db
      .update(Comment)
      .set({ content, updatedAt: new Date() })
      .where(eq(Comment.id, commentId));
  }

  async countCommentsByPostIds(postIds: number[]): Promise<Record<number, number>> {
    if (postIds.length === 0) return {};
    const rows = await this.db
      .select({
        postId: Comment.postId,
        cnt: count(),
      })
      .from(Comment)
      .where(and(inArray(Comment.postId, postIds), eq(Comment.deleted, false)))
      .groupBy(Comment.postId);

    return rows.reduce<Record<number, number>>((acc, row) => {
      acc[row.postId] = Number(row.cnt);
      return acc;
    }, {});
  }
}

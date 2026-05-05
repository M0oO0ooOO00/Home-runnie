import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { FeedRepository, type FeedPostQueryResult } from '@/post/feed/repository';
import {
  CreateFeedPostRequestDto,
  FeedPostResponseDto,
  GetFeedPostsResponseDto,
} from '@/post/feed/dto';
import { AuthorDto, AuthorType } from '@/post/shared/dto/author.dto';
import { Team } from '@/common/enums';
import { ReactionRepository } from '@/reaction/repository';
import { ReactionTargetType } from '@/reaction/domain';

@Injectable()
export class FeedService {
  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly reactionRepository: ReactionRepository,
  ) {}

  async createFeedPost(
    memberId: number,
    dto: CreateFeedPostRequestDto,
  ): Promise<FeedPostResponseDto> {
    const { content, images = [] } = dto;

    const post = await this.feedRepository.createFeedPost(memberId, content, images);

    const detail = await this.feedRepository.findFeedPostById(post.id);
    if (!detail) {
      throw new InternalServerErrorException('생성된 FEED 게시글 조회 실패');
    }

    return this.toResponse(detail, 0, false);
  }

  async getFeedPostDetail(
    postId: number,
    viewerMemberId: number | null,
  ): Promise<FeedPostResponseDto> {
    const detail = await this.feedRepository.findFeedPostById(postId);
    if (!detail) {
      throw new NotFoundException('해당 게시글을 찾을 수 없습니다.');
    }

    const likeCount = await this.reactionRepository.countLikes(ReactionTargetType.POST, detail.id);
    const isLiked =
      viewerMemberId !== null
        ? (
            await this.reactionRepository.findLikedTargetIds(
              viewerMemberId,
              ReactionTargetType.POST,
              [detail.id],
            )
          ).has(detail.id)
        : false;

    return this.toResponse(detail, likeCount, isLiked);
  }

  async getFeedPosts(
    cursor: string | null,
    limit: number,
    viewerMemberId: number | null,
  ): Promise<GetFeedPostsResponseDto> {
    const cursorId = cursor ? this.decodeCursor(cursor) : null;

    const rows = await this.feedRepository.findFeedPosts(cursorId, limit + 1);

    const hasMore = rows.length > limit;
    const sliced = hasMore ? rows.slice(0, limit) : rows;
    const lastItem = sliced[sliced.length - 1];
    const nextCursor = hasMore && lastItem ? this.encodeCursor(lastItem.id) : null;

    const ids = sliced.map((row) => row.id);
    const likeCountByPostId = await this.reactionRepository.countLikesByTargetIds(
      ReactionTargetType.POST,
      ids,
    );
    const likedSet =
      viewerMemberId !== null
        ? await this.reactionRepository.findLikedTargetIds(
            viewerMemberId,
            ReactionTargetType.POST,
            ids,
          )
        : new Set<number>();

    return new GetFeedPostsResponseDto({
      items: sliced.map((row) =>
        this.toResponse(row, likeCountByPostId[row.id] ?? 0, likedSet.has(row.id)),
      ),
      nextCursor,
    });
  }

  private encodeCursor(id: number): string {
    return Buffer.from(String(id), 'utf-8').toString('base64');
  }

  private decodeCursor(cursor: string): number | null {
    try {
      const id = parseInt(Buffer.from(cursor, 'base64').toString('utf-8'), 10);
      return Number.isFinite(id) ? id : null;
    } catch {
      return null;
    }
  }

  private toResponse(
    detail: FeedPostQueryResult,
    likeCount: number,
    isLiked: boolean,
  ): FeedPostResponseDto {
    return new FeedPostResponseDto({
      id: detail.id,
      author: new AuthorDto({
        type: AuthorType.MEMBER,
        id: detail.authorId,
        nickname: detail.authorNickname ?? '',
        supportTeam: detail.supportTeam as Team | null,
      }),
      content: detail.content,
      images: detail.images,
      likeCount,
      isLiked,
      commentCount: 0,
      createdAt: detail.createdAt.toISOString(),
    });
  }
}

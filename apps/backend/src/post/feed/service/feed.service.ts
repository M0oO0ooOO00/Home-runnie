import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FeedRepository, type FeedPostQueryResult } from '@/post/feed/repository';
import {
  CreateFeedPostRequestDto,
  FeedPostResponseDto,
  GetFeedPostsResponseDto,
  UpdateFeedPostRequestDto,
} from '@/post/feed/dto';
import { AuthorDto, AuthorType } from '@/post/shared/dto/author.dto';
import { Team } from '@/common/enums';
import { ReactionRepository } from '@/reaction/repository';
import { ReactionTargetType } from '@/reaction/domain';
import { FeedCommentRepository } from '@/post/feed/comment/repository';
import { PostSharedRepository } from '@/post/shared/repository';

@Injectable()
export class FeedService {
  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly reactionRepository: ReactionRepository,
    private readonly feedCommentRepository: FeedCommentRepository,
    private readonly postSharedRepository: PostSharedRepository,
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

    return this.toResponse(detail, 0, false, 0);
  }

  async updateFeedPost(
    memberId: number,
    postId: number,
    dto: UpdateFeedPostRequestDto,
  ): Promise<FeedPostResponseDto> {
    if (dto.content === undefined && dto.images === undefined) {
      throw new BadRequestException('content 또는 images 중 최소 하나는 전달해야 합니다.');
    }

    const meta = await this.feedRepository.findFeedPostMeta(postId);
    if (!meta) {
      throw new NotFoundException('해당 게시글을 찾을 수 없습니다.');
    }
    if (meta.authorId !== memberId) {
      throw new ForbiddenException('작성자만 수정할 수 있습니다.');
    }

    await this.feedRepository.updateFeedPost(postId, {
      content: dto.content,
      images: dto.images,
    });

    return this.getFeedPostDetail(postId, memberId);
  }

  async deleteFeedPost(memberId: number, postId: number): Promise<{ id: number }> {
    const meta = await this.feedRepository.findFeedPostMeta(postId);
    if (!meta) {
      throw new NotFoundException('해당 게시글을 찾을 수 없습니다.');
    }
    if (meta.authorId !== memberId) {
      throw new ForbiddenException('작성자만 삭제할 수 있습니다.');
    }

    const deleted = await this.postSharedRepository.softDelete(postId);
    if (!deleted) {
      throw new NotFoundException('해당 게시글을 찾을 수 없습니다.');
    }

    return { id: deleted.id };
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

    const commentCountByPostId = await this.feedCommentRepository.countCommentsByPostIds([
      detail.id,
    ]);
    const commentCount = commentCountByPostId[detail.id] ?? 0;

    return this.toResponse(detail, likeCount, isLiked, commentCount);
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
    const commentCountByPostId = await this.feedCommentRepository.countCommentsByPostIds(ids);

    return new GetFeedPostsResponseDto({
      items: sliced.map((row) =>
        this.toResponse(
          row,
          likeCountByPostId[row.id] ?? 0,
          likedSet.has(row.id),
          commentCountByPostId[row.id] ?? 0,
        ),
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
    commentCount: number,
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
      commentCount,
      createdAt: detail.createdAt.toISOString(),
      updatedAt: detail.updatedAt.toISOString(),
    });
  }
}

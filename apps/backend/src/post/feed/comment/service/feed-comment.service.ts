import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateFeedCommentRequestDto,
  FeedCommentResponseDto,
  UpdateFeedCommentRequestDto,
} from '@/post/feed/comment/dto';
import { AuthorDto, AuthorType } from '@/post/shared/dto/author.dto';
import { Team } from '@/common/enums';
import {
  FEED_COMMENT_READER,
  FEED_COMMENT_WRITER,
  type FeedCommentQueryResult,
  type FeedCommentReader,
  type FeedCommentWriter,
} from '@/post/feed/comment/port';

@Injectable()
export class FeedCommentService {
  constructor(
    @Inject(FEED_COMMENT_READER)
    private readonly feedCommentReader: FeedCommentReader,
    @Inject(FEED_COMMENT_WRITER)
    private readonly feedCommentWriter: FeedCommentWriter,
  ) {}

  async createComment(
    memberId: number,
    postId: number,
    dto: CreateFeedCommentRequestDto,
  ): Promise<FeedCommentResponseDto> {
    const isFeed = await this.feedCommentReader.assertPostIsFeed(postId);
    if (!isFeed) {
      throw new NotFoundException('해당 피드 게시글을 찾을 수 없습니다.');
    }

    const content = dto.content?.trim() ?? '';
    const imageUrl = dto.imageUrl?.trim() || null;
    if (!content && !imageUrl) {
      throw new BadRequestException('댓글 본문 또는 이미지 중 하나는 필요합니다.');
    }

    let parentId: number | null = null;
    if (dto.parentId !== undefined && dto.parentId !== null) {
      const parent = await this.feedCommentReader.findCommentById(dto.parentId);
      if (!parent || parent.deleted) {
        throw new NotFoundException('부모 댓글을 찾을 수 없습니다.');
      }
      if (parent.postId !== postId) {
        throw new BadRequestException('부모 댓글이 다른 게시글에 속해 있습니다.');
      }
      if (parent.parentId !== null) {
        throw new BadRequestException('대댓글에는 답글을 달 수 없습니다 (depth 1 제한).');
      }
      parentId = dto.parentId;
    }

    const created = await this.feedCommentWriter.createComment(
      memberId,
      postId,
      content,
      parentId,
      imageUrl,
    );
    if (!created) {
      throw new InternalServerErrorException('댓글 생성 실패');
    }

    const joined = await this.feedCommentReader.findFeedCommentJoined(created.id);
    if (!joined) {
      throw new InternalServerErrorException('생성된 댓글 조회 실패');
    }

    return this.toResponse(joined);
  }

  async getComments(postId: number): Promise<FeedCommentResponseDto[]> {
    const isFeed = await this.feedCommentReader.assertPostIsFeed(postId);
    if (!isFeed) {
      throw new NotFoundException('해당 피드 게시글을 찾을 수 없습니다.');
    }

    const rows = await this.feedCommentReader.findCommentsByPostId(postId);

    const rootById = new Map<number, FeedCommentResponseDto>();
    const replies: FeedCommentQueryResult[] = [];

    for (const row of rows) {
      if (row.parentId === null) {
        rootById.set(row.id, this.toResponse(row));
      } else {
        replies.push(row);
      }
    }

    for (const reply of replies) {
      const root = rootById.get(reply.parentId!);
      if (root) {
        root.replies.push(this.toResponse(reply));
      }
    }

    return Array.from(rootById.values());
  }

  async updateComment(
    memberId: number,
    postId: number,
    commentId: number,
    dto: UpdateFeedCommentRequestDto,
  ): Promise<FeedCommentResponseDto> {
    const comment = await this.feedCommentReader.findCommentById(commentId);
    if (!comment || comment.deleted) {
      throw new NotFoundException('해당 댓글을 찾을 수 없습니다.');
    }
    if (comment.postId !== postId) {
      throw new BadRequestException('댓글이 다른 게시글에 속해 있습니다.');
    }
    if (comment.authorId !== memberId) {
      throw new ForbiddenException('작성자만 수정할 수 있습니다.');
    }

    const content = dto.content?.trim() ?? comment.content;
    const imageUrl = dto.imageUrl === undefined ? comment.imageUrl : dto.imageUrl?.trim() || null;

    if (!content && !imageUrl) {
      throw new BadRequestException('댓글 본문 또는 이미지 중 하나는 필요합니다.');
    }

    await this.feedCommentWriter.updateComment(commentId, content, imageUrl);

    const joined = await this.feedCommentReader.findFeedCommentJoined(commentId);
    if (!joined) {
      throw new InternalServerErrorException('수정된 댓글 조회 실패');
    }
    return this.toResponse(joined);
  }

  async deleteComment(memberId: number, postId: number, commentId: number) {
    const comment = await this.feedCommentReader.findCommentById(commentId);
    if (!comment || comment.deleted) {
      throw new NotFoundException('해당 댓글을 찾을 수 없습니다.');
    }
    if (comment.postId !== postId) {
      throw new BadRequestException('댓글이 다른 게시글에 속해 있습니다.');
    }
    if (comment.authorId !== memberId) {
      throw new ForbiddenException('작성자만 삭제할 수 있습니다.');
    }

    await this.feedCommentWriter.softDeleteComment(commentId);
    return { id: commentId };
  }

  private toResponse(detail: FeedCommentQueryResult): FeedCommentResponseDto {
    return new FeedCommentResponseDto({
      id: detail.id,
      author: new AuthorDto({
        type: AuthorType.MEMBER,
        id: detail.authorId,
        nickname: detail.authorNickname ?? '',
        supportTeam: detail.supportTeam as Team | null,
      }),
      content: detail.content,
      imageUrl: detail.imageUrl,
      parentId: detail.parentId,
      replies: [],
      createdAt: detail.createdAt.toISOString(),
    });
  }
}

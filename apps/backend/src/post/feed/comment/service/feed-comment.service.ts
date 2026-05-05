import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FeedCommentRepository, type FeedCommentQueryResult } from '@/post/feed/comment/repository';
import { CreateFeedCommentRequestDto, FeedCommentResponseDto } from '@/post/feed/comment/dto';
import { AuthorDto, AuthorType } from '@/post/shared/dto/author.dto';
import { Team } from '@/common/enums';

@Injectable()
export class FeedCommentService {
  constructor(private readonly feedCommentRepository: FeedCommentRepository) {}

  async createComment(
    memberId: number,
    postId: number,
    dto: CreateFeedCommentRequestDto,
  ): Promise<FeedCommentResponseDto> {
    const isFeed = await this.feedCommentRepository.assertPostIsFeed(postId);
    if (!isFeed) {
      throw new NotFoundException('해당 피드 게시글을 찾을 수 없습니다.');
    }

    let parentId: number | null = null;
    if (dto.parentId !== undefined && dto.parentId !== null) {
      const parent = await this.feedCommentRepository.findCommentById(dto.parentId);
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

    const created = await this.feedCommentRepository.createComment(
      memberId,
      postId,
      dto.content,
      parentId,
    );
    if (!created) {
      throw new InternalServerErrorException('댓글 생성 실패');
    }

    const joined = await this.feedCommentRepository.findFeedCommentJoined(created.id);
    if (!joined) {
      throw new InternalServerErrorException('생성된 댓글 조회 실패');
    }

    return this.toResponse(joined);
  }

  async getComments(postId: number): Promise<FeedCommentResponseDto[]> {
    const isFeed = await this.feedCommentRepository.assertPostIsFeed(postId);
    if (!isFeed) {
      throw new NotFoundException('해당 피드 게시글을 찾을 수 없습니다.');
    }

    const rows = await this.feedCommentRepository.findCommentsByPostId(postId);

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

  async deleteComment(memberId: number, postId: number, commentId: number) {
    const comment = await this.feedCommentRepository.findCommentById(commentId);
    if (!comment || comment.deleted) {
      throw new NotFoundException('해당 댓글을 찾을 수 없습니다.');
    }
    if (comment.postId !== postId) {
      throw new BadRequestException('댓글이 다른 게시글에 속해 있습니다.');
    }
    if (comment.authorId !== memberId) {
      throw new ForbiddenException('작성자만 삭제할 수 있습니다.');
    }

    await this.feedCommentRepository.softDeleteComment(commentId);
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
      parentId: detail.parentId,
      replies: [],
      createdAt: detail.createdAt.toISOString(),
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { FeedRepository, type FeedPostQueryResult } from '@/post/feed/repository';
import { CreateFeedPostRequestDto, FeedPostResponseDto } from '@/post/feed/dto';
import { AuthorDto, AuthorType } from '@/post/shared/dto/author.dto';
import { Team } from '@/common/enums';

@Injectable()
export class FeedService {
  constructor(private readonly feedRepository: FeedRepository) {}

  async createFeedPost(
    memberId: number,
    dto: CreateFeedPostRequestDto,
  ): Promise<FeedPostResponseDto> {
    const { content, images = [] } = dto;

    const post = await this.feedRepository.createFeedPost(memberId, content, images);

    const detail = await this.feedRepository.findFeedPostById(post.id);
    if (!detail) {
      throw new Error('생성된 FEED 게시글 조회 실패');
    }

    return this.toResponse(detail);
  }

  async getFeedPostDetail(postId: number): Promise<FeedPostResponseDto> {
    const detail = await this.feedRepository.findFeedPostById(postId);
    if (!detail) {
      throw new NotFoundException('해당 게시글을 찾을 수 없습니다.');
    }
    return this.toResponse(detail);
  }

  private toResponse(detail: FeedPostQueryResult): FeedPostResponseDto {
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
      likeCount: 0,
      isLiked: false,
      commentCount: 0,
      createdAt: detail.createdAt.toISOString(),
    });
  }
}

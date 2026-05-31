import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { ReactionRepository } from '@/reaction/repository';
import { ReactionTargetType } from '@/reaction/domain';
import { ToggleLikeResponseDto } from '@/reaction/dto';
import { Inject } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Post } from '@/post/shared/domain';
import { Comment } from '@/comment/domain';
import { DATABASE_CONNECTION } from '@/common';

@Injectable()
export class ReactionService {
  constructor(
    private readonly reactionRepository: ReactionRepository,
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async toggleLike(
    memberId: number,
    targetType: ReactionTargetType,
    targetId: number,
  ): Promise<ToggleLikeResponseDto> {
    await this.assertTargetExists(targetType, targetId);

    const existing = await this.reactionRepository.findLike(memberId, targetType, targetId);

    if (existing && !existing.deleted) {
      await this.reactionRepository.softDeleteLike(existing.id);
    } else if (existing) {
      await this.reactionRepository.restoreLike(existing.id);
    } else {
      await this.reactionRepository.createLike(memberId, targetType, targetId);
    }

    const likeCount = await this.reactionRepository.countLikes(targetType, targetId);

    return new ToggleLikeResponseDto({
      liked: !existing || Boolean(existing.deleted),
      likeCount,
    });
  }

  private async assertTargetExists(
    targetType: ReactionTargetType,
    targetId: number,
  ): Promise<void> {
    if (targetType === ReactionTargetType.POST) {
      const [post] = await this.db
        .select({ id: Post.id })
        .from(Post)
        .where(eq(Post.id, targetId))
        .limit(1);
      if (!post) {
        throw new NotFoundException('해당 게시글을 찾을 수 없습니다.');
      }
      return;
    }

    if (targetType === ReactionTargetType.COMMENT) {
      const [comment] = await this.db
        .select({ id: Comment.id })
        .from(Comment)
        .where(and(eq(Comment.id, targetId), eq(Comment.deleted, false)))
        .limit(1);
      if (!comment) {
        throw new NotFoundException('해당 댓글을 찾을 수 없습니다.');
      }
      return;
    }

    throw new BadRequestException('지원하지 않는 좋아요 대상입니다.');
  }
}

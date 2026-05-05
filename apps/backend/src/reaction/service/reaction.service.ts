import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { ReactionRepository } from '@/reaction/repository';
import { ReactionTargetType } from '@/reaction/domain';
import { ToggleLikeResponseDto } from '@/reaction/dto';
import { Inject } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Post } from '@/post/shared/domain';
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
    if (targetType !== ReactionTargetType.POST) {
      throw new BadRequestException('현재는 POST 타입만 지원합니다 (COMMENT는 추후 지원 예정)');
    }

    await this.assertTargetExists(targetType, targetId);

    const existing = await this.reactionRepository.findLike(memberId, targetType, targetId);

    if (existing) {
      await this.reactionRepository.softDeleteLike(existing.id);
    } else {
      await this.reactionRepository.createLike(memberId, targetType, targetId);
    }

    const likeCount = await this.reactionRepository.countLikes(targetType, targetId);

    return new ToggleLikeResponseDto({
      liked: !existing,
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
    }
  }
}

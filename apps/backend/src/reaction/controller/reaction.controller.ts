import { Controller, Param, ParseEnumPipe, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ReactionService } from '@/reaction/service';
import { ReactionTargetType } from '@/reaction/domain';
import { ToggleLikeResponseDto } from '@/reaction/dto';
import { CurrentMember } from '@/common';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { ReactionControllerSwagger, ToggleLikeSwagger } from '@/reaction/swagger';

@Controller('reaction')
@ReactionControllerSwagger
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Post('like/:targetType/:targetId')
  @UseGuards(JwtAuthGuard)
  @ToggleLikeSwagger
  async toggleLike(
    @CurrentMember() memberId: number,
    @Param('targetType', new ParseEnumPipe(ReactionTargetType)) targetType: ReactionTargetType,
    @Param('targetId', ParseIntPipe) targetId: number,
  ): Promise<ToggleLikeResponseDto> {
    return this.reactionService.toggleLike(memberId, targetType, targetId);
  }
}

import { Controller, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ScrapService } from '@/scrap/service';
import { CurrentMember } from '@/common';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('스크랩')
@Controller('scrap')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ScrapController {
  constructor(private readonly scrapService: ScrapService) {}

  @Post(':postId')
  @ApiOperation({ summary: '스크랩 토글 (추가/해제)' })
  async toggleScrap(
    @CurrentMember() memberId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.scrapService.toggleScrap(memberId, postId);
  }
}

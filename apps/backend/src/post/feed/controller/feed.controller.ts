import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { FeedService } from '@/post/feed/service';
import { CreateFeedPostRequestDto, FeedPostResponseDto } from '@/post/feed/dto';
import { CurrentMember } from '@/common';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import {
  CreateFeedPostSwagger,
  GetFeedPostDetailSwagger,
  FeedControllerSwagger,
} from '@/post/feed/swagger';

@Controller('post/feed')
@FeedControllerSwagger
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @CreateFeedPostSwagger
  async createFeedPost(
    @CurrentMember() memberId: number,
    @Body() dto: CreateFeedPostRequestDto,
  ): Promise<FeedPostResponseDto> {
    return this.feedService.createFeedPost(memberId, dto);
  }

  @Get(':postId')
  @UseGuards(JwtAuthGuard)
  @GetFeedPostDetailSwagger
  async getFeedPostDetail(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<FeedPostResponseDto> {
    return this.feedService.getFeedPostDetail(postId);
  }
}

import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { FeedService } from '@/post/feed/service';
import {
  CreateFeedPostRequestDto,
  FeedPostResponseDto,
  GetFeedPostsQueryDto,
  GetFeedPostsResponseDto,
} from '@/post/feed/dto';
import { CurrentMember } from '@/common';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import {
  CreateFeedPostSwagger,
  GetFeedPostDetailSwagger,
  GetFeedPostsSwagger,
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

  @Get()
  @GetFeedPostsSwagger
  async getFeedPosts(@Query() query: GetFeedPostsQueryDto): Promise<GetFeedPostsResponseDto> {
    return this.feedService.getFeedPosts(query.cursor ?? null, query.limit ?? 10);
  }

  @Get(':postId')
  @GetFeedPostDetailSwagger
  async getFeedPostDetail(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<FeedPostResponseDto> {
    return this.feedService.getFeedPostDetail(postId);
  }
}

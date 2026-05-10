import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FeedService } from '@/post/feed/service';
import {
  CreateFeedPostRequestDto,
  FeedPostResponseDto,
  GetFeedPostsQueryDto,
  GetFeedPostsResponseDto,
  UpdateFeedPostRequestDto,
} from '@/post/feed/dto';
import { CurrentMember, CurrentMemberOptional } from '@/common';
import { JwtAuthGuard, OptionalJwtAuthGuard } from '@/auth/guards';
import {
  CreateFeedPostSwagger,
  DeleteFeedPostSwagger,
  GetFeedPostDetailSwagger,
  GetFeedPostsSwagger,
  FeedControllerSwagger,
  UpdateFeedPostSwagger,
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
  @UseGuards(OptionalJwtAuthGuard)
  @GetFeedPostsSwagger
  async getFeedPosts(
    @Query() query: GetFeedPostsQueryDto,
    @CurrentMemberOptional() viewerMemberId: number | null,
  ): Promise<GetFeedPostsResponseDto> {
    return this.feedService.getFeedPosts(query.cursor ?? null, query.limit ?? 10, viewerMemberId);
  }

  @Get(':postId')
  @UseGuards(OptionalJwtAuthGuard)
  @GetFeedPostDetailSwagger
  async getFeedPostDetail(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentMemberOptional() viewerMemberId: number | null,
  ): Promise<FeedPostResponseDto> {
    return this.feedService.getFeedPostDetail(postId, viewerMemberId);
  }

  @Patch(':postId')
  @UseGuards(JwtAuthGuard)
  @UpdateFeedPostSwagger
  async updateFeedPost(
    @CurrentMember() memberId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() dto: UpdateFeedPostRequestDto,
  ): Promise<FeedPostResponseDto> {
    return this.feedService.updateFeedPost(memberId, postId, dto);
  }

  @Delete(':postId')
  @UseGuards(JwtAuthGuard)
  @DeleteFeedPostSwagger
  async deleteFeedPost(
    @CurrentMember() memberId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<{ id: number }> {
    return this.feedService.deleteFeedPost(memberId, postId);
  }
}

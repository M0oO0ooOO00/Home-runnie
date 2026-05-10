import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FeedCommentService } from '@/post/feed/comment/service';
import {
  CreateFeedCommentRequestDto,
  FeedCommentResponseDto,
  UpdateFeedCommentRequestDto,
} from '@/post/feed/comment/dto';
import { CurrentMember } from '@/common';
import { JwtAuthGuard } from '@/auth/guards';
import {
  CreateFeedCommentSwagger,
  DeleteFeedCommentSwagger,
  FeedCommentControllerSwagger,
  GetFeedCommentsSwagger,
  UpdateFeedCommentSwagger,
} from '@/post/feed/comment/swagger';

@Controller('post/feed/:postId/comments')
@FeedCommentControllerSwagger
export class FeedCommentController {
  constructor(private readonly feedCommentService: FeedCommentService) {}

  @Get()
  @GetFeedCommentsSwagger
  async getComments(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<FeedCommentResponseDto[]> {
    return this.feedCommentService.getComments(postId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @CreateFeedCommentSwagger
  async createComment(
    @CurrentMember() memberId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() dto: CreateFeedCommentRequestDto,
  ): Promise<FeedCommentResponseDto> {
    return this.feedCommentService.createComment(memberId, postId, dto);
  }

  @Patch(':commentId')
  @UseGuards(JwtAuthGuard)
  @UpdateFeedCommentSwagger
  async updateComment(
    @CurrentMember() memberId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() dto: UpdateFeedCommentRequestDto,
  ): Promise<FeedCommentResponseDto> {
    return this.feedCommentService.updateComment(memberId, postId, commentId, dto);
  }

  @Delete(':commentId')
  @UseGuards(JwtAuthGuard)
  @DeleteFeedCommentSwagger
  async deleteComment(
    @CurrentMember() memberId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.feedCommentService.deleteComment(memberId, postId, commentId);
  }
}

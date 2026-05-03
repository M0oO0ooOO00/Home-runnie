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
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { RecruitmentService } from '@/post/recruitment/service';
import {
  CreateRecruitmentPostRequestDto,
  CreateRecruitmentPostResponseDto,
  GetRecruitmentPostsQueryDto,
  GetRecruitmentPostDetailResponseDto,
  GetRecruitmentPostsResponseDto,
  UpdateRecruitmentPostStatusRequestDto,
  UpdateRecruitmentPostStatusResponseDto,
} from '@/post/recruitment/dto';
import { CurrentMember } from '@/common';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CreateRecruitmentPostSwagger } from '@/post/recruitment/swagger';

@Controller('post/recruitment')
export class RecruitmentController {
  constructor(private readonly recruitmentService: RecruitmentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @CreateRecruitmentPostSwagger
  async createRecruitmentPost(
    @CurrentMember() memberId: number,
    @Body() createRecruitmentPostDto: CreateRecruitmentPostRequestDto,
  ): Promise<CreateRecruitmentPostResponseDto> {
    return await this.recruitmentService.createRecruitmentPost(memberId, createRecruitmentPostDto);
  }

  @Get()
  async getRecruitmentPosts(
    @Query() query: GetRecruitmentPostsQueryDto,
  ): Promise<GetRecruitmentPostsResponseDto> {
    return this.recruitmentService.getRecruitmentPosts(query);
  }

  @Get(':postId')
  async getRecruitmentPostDetail(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<GetRecruitmentPostDetailResponseDto> {
    return this.recruitmentService.getRecruitmentPostDetail(postId);
  }

  @Delete(':postId')
  @UseGuards(JwtAuthGuard)
  async deleteRecruitmentPost(
    @CurrentMember() memberId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.recruitmentService.deleteRecruitmentPost(memberId, postId);
  }

  @Patch(':postId/status')
  @UseGuards(JwtAuthGuard)
  async updateRecruitmentPostStatus(
    @CurrentMember() memberId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() dto: UpdateRecruitmentPostStatusRequestDto,
  ): Promise<UpdateRecruitmentPostStatusResponseDto> {
    return this.recruitmentService.updateRecruitmentPostStatus(memberId, postId, dto);
  }
}

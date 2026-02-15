import { Body, Controller, Post } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { PostService } from '@/post/service';
import { CreateRecruitmentPostRequestDto, CreateRecruitmentPostResponseDto } from '@/post/dto';
import { CurrentMember } from '@/common';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CreateRecruitmentPostSwagger } from '@/post/swagger';

@Controller('post')
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('recruitment')
  @CreateRecruitmentPostSwagger
  async createRecruitmentPost(
    @CurrentMember() memberId: number,
    @Body() createRecruitmentPostDto: CreateRecruitmentPostRequestDto,
  ): Promise<CreateRecruitmentPostResponseDto> {
    return await this.postService.createRecruitmentPost(memberId, createRecruitmentPostDto);
  }
}

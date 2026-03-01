import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '@/post/repository';
import {
  CreateRecruitmentPostRequestDto,
  CreateRecruitmentPostResponseDto,
  GetRecruitmentPostDetailResponseDto,
  GetRecruitmentPostsResponseDto,
  RecruitmentPostItemResponseDto,
} from '@/post/dto';
import { TicketingType } from '@/common/enums/ticketing-type.enum';
import { PreferGender } from '@/common/enums/prefer-gender.enum';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async createRecruitmentPost(
    authorId: number,
    dto: CreateRecruitmentPostRequestDto,
  ): Promise<CreateRecruitmentPostResponseDto> {
    const {
      title,
      gameDate,
      stadium,
      teamA,
      teamB,
      headcount,
      ticketStatus,
      favTeam,
      prefGender,
      note,
    } = dto;

    let ticketingType: TicketingType | null = null;
    if (ticketStatus === 'have') {
      ticketingType = TicketingType.SEPARATE;
    } else if (ticketStatus === 'need') {
      ticketingType = TicketingType.TOGETHER;
    }

    let preferGenderEnum: PreferGender;
    if (prefGender === 'F') {
      preferGenderEnum = PreferGender.FEMALE;
    } else if (prefGender === 'M') {
      preferGenderEnum = PreferGender.MALE;
    } else {
      preferGenderEnum = PreferGender.ANY;
    }

    const result = await this.postRepository.createRecruitmentPost(
      authorId,
      title,
      new Date(gameDate),
      stadium,
      teamA,
      teamB,
      parseInt(headcount, 10),
      preferGenderEnum,
      note || null,
      ticketingType,
      favTeam || null,
    );

    return {
      id: result.post.id,
      title: result.post.title,
      createdAt: result.post.createdAt,
    };
  }

  async getRecruitmentPosts(
    page: number = 1,
    limit: number = 10,
  ): Promise<GetRecruitmentPostsResponseDto> {
    const [posts, total] = await Promise.all([
      this.postRepository.findRecruitmentPosts(page, limit),
      this.postRepository.countRecruitmentPosts(),
    ]);

    const data = posts.map(
      (post) =>
        new RecruitmentPostItemResponseDto({
          id: post.id,
          title: post.title,
          gameDate: post.gameDate,
          teamHome: post.teamHome,
          teamAway: post.teamAway,
          createdAt: post.createdAt.toISOString(),
        }),
    );

    return new GetRecruitmentPostsResponseDto(data, total, page, limit);
  }

  async getRecruitmentPostDetail(postId: number): Promise<GetRecruitmentPostDetailResponseDto> {
    const post = await this.postRepository.findRecruitmentPostById(postId);
    if (!post) {
      throw new NotFoundException('해당 모집글을 찾을 수 없습니다.');
    }

    const response = new GetRecruitmentPostDetailResponseDto();
    response.id = post.id;
    response.title = post.title;
    response.gameDate = post.gameDate;
    response.gameTime = post.gameTime;
    response.stadium = post.stadium;
    response.teamHome = post.teamHome;
    response.teamAway = post.teamAway;
    response.recruitmentLimit = post.recruitmentLimit;
    response.currentParticipants = post.currentParticipants;
    response.preferGender = post.preferGender;
    response.message = post.message;
    response.ticketingType = post.ticketingType;
    response.supportTeam = post.supportTeam;
    response.createdAt = post.createdAt.toISOString();

    return response;
  }
}

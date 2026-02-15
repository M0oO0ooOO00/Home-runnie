import { Injectable } from '@nestjs/common';
import { PostRepository } from '@/post/repository';
import { CreateRecruitmentPostRequestDto, CreateRecruitmentPostResponseDto } from '@/post/dto';
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
}

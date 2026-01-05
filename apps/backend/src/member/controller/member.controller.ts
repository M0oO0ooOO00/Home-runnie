import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { MemberService } from '../service';
import { CreateMemberRequestDto, UpdateMyProfileRequestDto } from '../dto';
import {
  CreateMemberSwagger,
  GetMyProfileSwagger,
  GetScrappedRecruitmentsSwagger,
  GetWrittenRecruitmentsSwagger,
  GetParticipatedRecruitmentsSwagger,
  UpdateMyProfileSwagger,
  MemberControllerSwagger,
} from '../swagger';
import { CurrentMember, PaginationQueryDto } from '../../common';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('member')
@MemberControllerSwagger
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  @CreateMemberSwagger
  async signUp(@Body() createMemberDto: CreateMemberRequestDto) {
    const { name, email } = createMemberDto;
    // TODO : 바뀐 엔티티에 따라 다시 만들어야 함.
    await this.memberService.createMember(name, email);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @GetMyProfileSwagger
  async getMyInfo(@CurrentMember() memberId: number) {
    return await this.memberService.getMyProfile(memberId);
  }

  @Put('my')
  @UseGuards(JwtAuthGuard)
  @UpdateMyProfileSwagger
  async updateMyProfile(
    @CurrentMember() memberId: number,
    @Body() updateProfileDto: UpdateMyProfileRequestDto,
  ) {
    return await this.memberService.updateMyProfile(memberId, updateProfileDto);
  }

  @Get('my/scrapped-recruitments')
  @UseGuards(JwtAuthGuard)
  @GetScrappedRecruitmentsSwagger
  async getScrappedRecruitments(
    @CurrentMember() memberId: number,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return await this.memberService.getMyScrappedRecruitments(
      memberId,
      paginationQuery.page,
      paginationQuery.pageSize,
    );
  }

  @Get('my/written-recruitments')
  @UseGuards(JwtAuthGuard)
  @GetWrittenRecruitmentsSwagger
  async getWrittenRecruitments(
    @CurrentMember() memberId: number,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return await this.memberService.getMyWrittenRecruitments(
      memberId,
      paginationQuery.page,
      paginationQuery.pageSize,
    );
  }

  @Get('my/participated-recruitments')
  @UseGuards(JwtAuthGuard)
  @GetParticipatedRecruitmentsSwagger
  async getParticipatedRecruitments(
    @CurrentMember() memberId: number,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return await this.memberService.getMyParticipatedRecruitments(
      memberId,
      paginationQuery.page,
      paginationQuery.pageSize,
    );
  }
}

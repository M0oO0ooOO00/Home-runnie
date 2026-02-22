import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsArray,
} from 'class-validator';
import { Stadium } from '@/common/enums/stadium.enum';
import { Team } from '@/common/enums/team.enum';

export class CreateRecruitmentPostRequestDto {
  @ApiProperty({ description: '제목', example: '한화 vs 두산 직관 같이 가실 분 구해요!' })
  @IsString()
  title: string;

  @ApiProperty({ description: '경기 날짜', example: '2024-07-28T18:00:00Z' })
  @IsDateString()
  gameDate: string;

  @ApiProperty({ description: '경기 구장', enum: Stadium, example: Stadium.JAMSIL })
  @IsEnum(Stadium)
  stadium: Stadium;

  @ApiProperty({ description: '홈 팀', enum: Team, example: Team.HANWHA })
  @IsEnum(Team)
  teamA: Team;

  @ApiProperty({ description: '원정 팀', enum: Team, example: Team.DOOSAN })
  @IsEnum(Team)
  teamB: Team;

  @ApiProperty({ description: '모집 인원', example: '3' })
  @IsNumberString()
  headcount: string;

  @ApiProperty({ description: '티켓 현황', enum: ['have', 'need'], example: 'have' })
  @IsEnum(['have', 'need'])
  ticketStatus: 'have' | 'need';

  @ApiProperty({ description: '응원하는 팀', enum: Team, example: Team.HANWHA, required: false })
  @IsEnum(Team)
  @IsOptional()
  favTeam?: Team;

  @ApiProperty({ description: '성별', enum: ['F', 'M'], example: 'M', required: false })
  @IsEnum(['F', 'M'])
  @IsOptional()
  gender?: 'F' | 'M';

  @ApiProperty({ description: '선호하는 성별', enum: ['F', 'M', 'ANY'], example: 'ANY' })
  @IsEnum(['F', 'M', 'ANY'])
  prefGender: 'F' | 'M' | 'ANY';

  @ApiProperty({
    description: '성향 태그',
    type: [String],
    example: ['응원가 부르는거 좋아해요'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  picked?: string[];

  @ApiProperty({
    description: '하고 싶은 말',
    example: '즐거운 직관 되었으면 좋겠어요!',
    required: false,
  })
  @IsString()
  @IsOptional()
  note?: string;
}

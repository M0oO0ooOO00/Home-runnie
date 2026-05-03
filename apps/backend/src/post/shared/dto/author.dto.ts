import { ApiProperty } from '@nestjs/swagger';
import { Team } from '@/common/enums';

export enum AuthorType {
  MEMBER = 'member',
}

export class AuthorDto {
  @ApiProperty({
    description: '작성자 종류',
    enum: AuthorType,
    example: AuthorType.MEMBER,
  })
  type: AuthorType;

  @ApiProperty({ description: '회원 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '닉네임', example: '직관러' })
  nickname: string;

  @ApiProperty({
    description: '응원 팀',
    enum: Team,
    nullable: true,
    required: false,
    example: Team.DOOSAN,
  })
  supportTeam: Team | null;

  constructor(partial: Partial<AuthorDto>) {
    Object.assign(this, partial);
  }
}

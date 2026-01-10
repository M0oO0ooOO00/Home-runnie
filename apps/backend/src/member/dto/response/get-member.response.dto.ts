import { ApiProperty } from '@nestjs/swagger';
import { Member } from '@/member/domain';
import { GetMemberResponse } from '@homerunnie/shared';

export class GetMemberResponseDto implements GetMemberResponse {
  @ApiProperty({
    description: '사용자 ID',
    type: 'integer',
  })
  id: number;

  @ApiProperty({
    description: '사용자 이름',
    type: 'string',
    example: '김철수',
  })
  name: string;

  @ApiProperty({
    description: '생성일',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;

  static from(member: typeof Member.$inferSelect): GetMemberResponse {
    const dto = new GetMemberResponseDto();
    dto.id = member.id;
    dto.name = member.name;
    dto.createdAt = member.createdAt;
    return dto;
  }
}

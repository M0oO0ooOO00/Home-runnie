import { ApiProperty } from '@nestjs/swagger';

export class CreateRecruitmentPostResponseDto {
  @ApiProperty({ description: '생성된 게시글 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '제목', example: '한화 vs 두산 직관 같이 가실 분 구해요!' })
  title: string;

  @ApiProperty({ description: '생성 일시', example: '2024-07-28T10:00:00Z' })
  createdAt: Date;
}

import { ApiProperty } from '@nestjs/swagger';

export class RecruitmentCommentResponseDto {
  @ApiProperty({ description: '댓글 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '댓글 내용', example: '저도 관심 있어요!' })
  content: string;

  @ApiProperty({ description: '작성자 닉네임', nullable: true, example: '야구왕타돌이' })
  authorNickname: string | null;

  @ApiProperty({ description: '작성 시각', example: '2026-03-02T10:00:00.000Z' })
  createdAt: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateRecruitmentCommentRequestDto {
  @ApiProperty({ description: '댓글 내용', example: '저도 관심 있어요!' })
  @IsString()
  @MinLength(1)
  content: string;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateFeedCommentRequestDto {
  @ApiProperty({
    description: '댓글 본문',
    example: '잘 봤어요!',
    maxLength: 1000,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  content: string;

  @ApiPropertyOptional({
    description: '대댓글일 경우 부모 댓글 ID. 부모 댓글 자체는 root여야 함 (depth 1 제한).',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  parentId?: number;
}

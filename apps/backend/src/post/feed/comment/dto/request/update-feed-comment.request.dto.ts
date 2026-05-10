import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateFeedCommentRequestDto {
  @ApiProperty({
    description: '수정할 댓글 본문',
    example: '오타 수정했어요',
    maxLength: 1000,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  content: string;
}

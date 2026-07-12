import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class UpdateFeedCommentRequestDto {
  @ApiPropertyOptional({
    description: '수정할 댓글 본문',
    example: '오타 수정했어요',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  content?: string;

  @ApiPropertyOptional({
    description: '교체할 댓글 이미지 URL. null이면 기존 이미지를 제거합니다.',
    example: 'https://homerunnie-s3.s3.ap-northeast-2.amazonaws.com/feed/1/comment.jpg',
    maxLength: 2048,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsUrl({ require_protocol: true })
  @MaxLength(2048)
  imageUrl?: string | null;
}

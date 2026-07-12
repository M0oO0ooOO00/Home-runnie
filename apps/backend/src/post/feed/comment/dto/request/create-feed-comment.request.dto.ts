import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateFeedCommentRequestDto {
  @ApiPropertyOptional({
    description: '댓글 본문',
    example: '잘 봤어요!',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  content?: string;

  @ApiPropertyOptional({
    description: '댓글에 첨부할 이미지 URL. 댓글당 1개만 허용합니다.',
    example: 'https://homerunnie-s3.s3.ap-northeast-2.amazonaws.com/feed/1/comment.jpg',
    maxLength: 2048,
  })
  @IsOptional()
  @IsString()
  @IsUrl({ require_protocol: true })
  @MaxLength(2048)
  imageUrl?: string;

  @ApiPropertyOptional({
    description: '답글일 경우 부모 댓글 ID. 댓글/답글 모두 부모가 될 수 있습니다.',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  parentId?: number;
}

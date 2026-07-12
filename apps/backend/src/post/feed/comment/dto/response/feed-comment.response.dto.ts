import { ApiProperty } from '@nestjs/swagger';
import { AuthorDto } from '@/post/shared/dto/author.dto';

export class FeedCommentResponseDto {
  @ApiProperty({ description: '댓글 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '작성자 정보', type: AuthorDto })
  author: AuthorDto;

  @ApiProperty({ description: '댓글 본문', example: '잘 봤어요!' })
  content: string;

  @ApiProperty({
    description: '댓글 첨부 이미지 URL',
    nullable: true,
    example: 'https://homerunnie-s3.s3.ap-northeast-2.amazonaws.com/feed/1/comment.jpg',
  })
  imageUrl: string | null;

  @ApiProperty({
    description: '부모 댓글 ID (root 댓글이면 null)',
    nullable: true,
    example: null,
  })
  parentId: number | null;

  @ApiProperty({
    description: '답글 목록 (작성 시간 ASC). 답글도 하위 답글을 가질 수 있습니다.',
    type: [FeedCommentResponseDto],
  })
  replies: FeedCommentResponseDto[];

  @ApiProperty({ description: '작성 시간 (ISO 8601)', example: '2026-05-05T12:00:00.000Z' })
  createdAt: string;

  constructor(partial: Partial<FeedCommentResponseDto>) {
    Object.assign(this, partial);
  }
}

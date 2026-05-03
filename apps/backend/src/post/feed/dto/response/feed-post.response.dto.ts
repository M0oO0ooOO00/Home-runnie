import { ApiProperty } from '@nestjs/swagger';
import { AuthorDto } from '@/post/shared/dto/author.dto';

export class FeedPostResponseDto {
  @ApiProperty({ description: '게시글 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '작성자 정보', type: AuthorDto })
  author: AuthorDto;

  @ApiProperty({
    description: '본문 내용',
    example: '오늘 직관 갔는데 진짜 분위기 미쳤다 🔥',
  })
  content: string;

  @ApiProperty({
    description: '이미지 URL 배열 (최대 4장)',
    type: [String],
    example: ['https://cdn.example.com/img-1.jpg'],
  })
  images: string[];

  @ApiProperty({ description: '좋아요 수 (좋아요 기능 미구현 시 0)', example: 0 })
  likeCount: number;

  @ApiProperty({ description: '내가 좋아요 했는지 (좋아요 기능 미구현 시 false)', example: false })
  isLiked: boolean;

  @ApiProperty({ description: '댓글 수 (댓글 기능 미구현 시 0)', example: 0 })
  commentCount: number;

  @ApiProperty({ description: '작성 시간 (ISO 8601)', example: '2026-05-03T19:30:00.000Z' })
  createdAt: string;

  constructor(partial: Partial<FeedPostResponseDto>) {
    Object.assign(this, partial);
  }
}

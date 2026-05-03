import { ApiProperty } from '@nestjs/swagger';
import { FeedPostResponseDto } from './feed-post.response.dto';

export class GetFeedPostsResponseDto {
  @ApiProperty({ type: [FeedPostResponseDto], description: '피드 게시글 목록' })
  items: FeedPostResponseDto[];

  @ApiProperty({
    description: '다음 페이지 커서. null이면 마지막 페이지',
    nullable: true,
    example: 'MTAw',
  })
  nextCursor: string | null;

  constructor(partial: Partial<GetFeedPostsResponseDto>) {
    Object.assign(this, partial);
  }
}

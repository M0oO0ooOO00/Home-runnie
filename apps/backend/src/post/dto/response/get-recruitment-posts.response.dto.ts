import { ApiProperty } from '@nestjs/swagger';
import { RecruitmentPostItemResponseDto } from './recruitment-post-item.response.dto';

export class GetRecruitmentPostsResponseDto {
  @ApiProperty({ type: [RecruitmentPostItemResponseDto], description: '모집 게시글 목록' })
  data: RecruitmentPostItemResponseDto[];

  @ApiProperty({ description: '전체 게시글 수', example: 10 })
  total: number;

  @ApiProperty({ description: '현재 페이지', example: 1 })
  page: number;

  @ApiProperty({ description: '페이지당 항목 수', example: 20 })
  limit: number;

  constructor(data: RecruitmentPostItemResponseDto[], total: number, page: number, limit: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
  }
}

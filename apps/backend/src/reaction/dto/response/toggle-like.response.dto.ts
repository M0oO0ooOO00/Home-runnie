import { ApiProperty } from '@nestjs/swagger';

export class ToggleLikeResponseDto {
  @ApiProperty({
    description: '토글 후 현재 사용자의 좋아요 상태 (true=좋아요 됨)',
    example: true,
  })
  liked: boolean;

  @ApiProperty({ description: '토글 후 해당 타겟의 총 좋아요 수', example: 1 })
  likeCount: number;

  constructor(partial: Partial<ToggleLikeResponseDto>) {
    Object.assign(this, partial);
  }
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class GetFeedPostsQueryDto {
  @ApiPropertyOptional({
    description: '다음 페이지 커서 (이전 응답의 nextCursor 값)',
    example: 'MTAw',
  })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({
    description: '페이지 사이즈 (1~50, 기본 10)',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}

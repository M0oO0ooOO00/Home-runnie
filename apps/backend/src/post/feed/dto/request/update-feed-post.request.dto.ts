import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateFeedPostRequestDto {
  @ApiPropertyOptional({
    description: '본문 내용 (수정 시에만 전달)',
    example: '오타 수정했어요!',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  content?: string;

  @ApiPropertyOptional({
    description:
      '이미지 URL 배열 (전체 교체, 최대 4장). 빈 배열을 보내면 모든 이미지가 제거됩니다.',
    type: [String],
    example: ['https://cdn.example.com/img-1.jpg'],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(4)
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  images?: string[];
}

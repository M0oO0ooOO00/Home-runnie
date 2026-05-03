import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateFeedPostRequestDto {
  @ApiProperty({
    description: '본문 내용',
    example: '오늘 직관 갔는데 진짜 분위기 미쳤다 🔥',
    maxLength: 2000,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  content: string;

  @ApiPropertyOptional({
    description: '이미지 URL 배열 (최대 4장)',
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

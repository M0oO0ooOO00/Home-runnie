import { ApiProperty } from '@nestjs/swagger';

export class UploadImagesResponseDto {
  @ApiProperty({
    description: '업로드된 이미지 URL 목록',
    example: [
      'https://homerunnie.s3.ap-northeast-2.amazonaws.com/feed/1/550e8400-e29b-41d4-a716-446655440000.jpg',
    ],
  })
  urls: string[];

  constructor(urls: string[]) {
    this.urls = urls;
  }
}

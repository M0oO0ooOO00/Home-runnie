import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { GetFeedPostsResponseDto } from '@/post/feed/dto';
import { ErrorResponseDto } from '@/common';

export const GetFeedPostsSwagger = applyDecorators(
  ApiOperation({
    summary: '피드 게시글 목록 조회 (커서 기반 무한 스크롤)',
    description:
      'createdAt DESC + id DESC 정렬. cursor=base64(lastId) 와 limit(1~50, 기본 10)을 받아 반환.',
  }),
  ApiOkResponse({
    type: GetFeedPostsResponseDto,
    description: '피드 게시글 목록 + 다음 커서',
  }),
  ApiUnauthorizedResponse({
    type: ErrorResponseDto,
    description: '인증되지 않은 사용자',
  }),
  ApiInternalServerErrorResponse({
    type: ErrorResponseDto,
    description: '서버 내부 오류',
  }),
);

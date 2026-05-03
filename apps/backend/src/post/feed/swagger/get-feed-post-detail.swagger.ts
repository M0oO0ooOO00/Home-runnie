import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { FeedPostResponseDto } from '@/post/feed/dto';
import { ErrorResponseDto } from '@/common';

export const GetFeedPostDetailSwagger = applyDecorators(
  ApiOperation({
    summary: '피드 게시글 단건 조회',
    description: 'postId로 단일 피드 게시글을 조회합니다.',
  }),
  ApiParam({
    name: 'postId',
    type: Number,
    description: '조회할 피드 게시글 ID',
    example: 1,
  }),
  ApiOkResponse({
    type: FeedPostResponseDto,
    description: '피드 게시글 상세',
  }),
  ApiUnauthorizedResponse({
    type: ErrorResponseDto,
    description: '인증되지 않은 사용자',
  }),
  ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: '해당 피드 게시글을 찾을 수 없음',
  }),
  ApiInternalServerErrorResponse({
    type: ErrorResponseDto,
    description: '서버 내부 오류',
  }),
);

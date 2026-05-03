import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { CreateFeedPostRequestDto, FeedPostResponseDto } from '@/post/feed/dto';
import { ErrorResponseDto } from '@/common';

export const CreateFeedPostSwagger = applyDecorators(
  ApiOperation({
    summary: '피드 게시글 작성',
    description: '본문(필수)과 이미지 0~4장을 받아 피드 게시글을 작성합니다.',
  }),
  ApiBody({
    type: CreateFeedPostRequestDto,
    description: '본문 + 이미지 URL 배열',
  }),
  ApiCreatedResponse({
    type: FeedPostResponseDto,
    description: '작성된 피드 게시글 (작성자/카운트 0 포함)',
  }),
  ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: '유효성 검사 실패 (본문 길이 초과, 이미지 5장 이상 등)',
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

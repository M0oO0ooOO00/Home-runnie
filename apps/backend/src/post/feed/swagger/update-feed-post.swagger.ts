import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { FeedPostResponseDto, UpdateFeedPostRequestDto } from '@/post/feed/dto';
import { ErrorResponseDto } from '@/common';

export const UpdateFeedPostSwagger = applyDecorators(
  ApiOperation({
    summary: '피드 게시글 수정',
    description:
      '작성자 본인만 수정 가능. content/images 중 하나 이상 전달. images는 전체 교체이며 빈 배열을 보내면 모든 이미지가 제거됩니다.',
  }),
  ApiParam({ name: 'postId', type: Number, description: '수정할 게시글 ID', example: 1 }),
  ApiBody({ type: UpdateFeedPostRequestDto }),
  ApiOkResponse({ type: FeedPostResponseDto, description: '수정된 피드 게시글' }),
  ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: '본문/이미지 모두 누락 또는 유효성 검사 실패',
  }),
  ApiUnauthorizedResponse({ type: ErrorResponseDto, description: '인증되지 않은 사용자' }),
  ApiForbiddenResponse({ type: ErrorResponseDto, description: '작성자가 아니어서 권한 없음' }),
  ApiNotFoundResponse({ type: ErrorResponseDto, description: '게시글을 찾을 수 없음' }),
  ApiInternalServerErrorResponse({ type: ErrorResponseDto, description: '서버 내부 오류' }),
);

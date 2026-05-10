import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FeedCommentResponseDto, UpdateFeedCommentRequestDto } from '@/post/feed/comment/dto';
import { ErrorResponseDto } from '@/common';

export const UpdateFeedCommentSwagger = applyDecorators(
  ApiOperation({
    summary: '피드 댓글 수정',
    description: '작성자 본인만 수정 가능. content를 새 값으로 교체합니다.',
  }),
  ApiParam({ name: 'postId', type: Number, example: 1 }),
  ApiParam({ name: 'commentId', type: Number, example: 10 }),
  ApiBody({ type: UpdateFeedCommentRequestDto }),
  ApiOkResponse({ type: FeedCommentResponseDto, description: '수정된 댓글' }),
  ApiBadRequestResponse({ type: ErrorResponseDto, description: '댓글이 다른 게시글 소속 등' }),
  ApiUnauthorizedResponse({ type: ErrorResponseDto, description: '인증되지 않은 사용자' }),
  ApiForbiddenResponse({ type: ErrorResponseDto, description: '작성자가 아니어서 권한 없음' }),
  ApiNotFoundResponse({ type: ErrorResponseDto, description: '댓글 없음' }),
  ApiInternalServerErrorResponse({ type: ErrorResponseDto, description: '서버 내부 오류' }),
);

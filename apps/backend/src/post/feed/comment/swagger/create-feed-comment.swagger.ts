import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { CreateFeedCommentRequestDto, FeedCommentResponseDto } from '@/post/feed/comment/dto';
import { ErrorResponseDto } from '@/common';

export const CreateFeedCommentSwagger = applyDecorators(
  ApiOperation({
    summary: '피드 댓글/대댓글 작성',
    description:
      'parentId 없으면 root 댓글, parentId 있으면 대댓글. 대댓글의 parent는 root여야 함 (depth 1 제한).',
  }),
  ApiParam({ name: 'postId', type: Number, example: 1 }),
  ApiBody({ type: CreateFeedCommentRequestDto }),
  ApiCreatedResponse({ type: FeedCommentResponseDto, description: '작성된 댓글' }),
  ApiBadRequestResponse({ type: ErrorResponseDto, description: '유효성 실패 / depth 위반' }),
  ApiUnauthorizedResponse({ type: ErrorResponseDto, description: '인증되지 않은 사용자' }),
  ApiNotFoundResponse({ type: ErrorResponseDto, description: '게시글 / 부모 댓글 없음' }),
  ApiInternalServerErrorResponse({ type: ErrorResponseDto, description: '서버 내부 오류' }),
);

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
      'parentId 없으면 root 댓글, parentId 있으면 해당 댓글의 답글입니다. 댓글/답글 모두 부모가 될 수 있습니다. 본문 또는 이미지 URL 중 하나는 필수이며, 이미지는 댓글당 1개만 허용합니다.',
  }),
  ApiParam({ name: 'postId', type: Number, example: 1 }),
  ApiBody({ type: CreateFeedCommentRequestDto }),
  ApiCreatedResponse({ type: FeedCommentResponseDto, description: '작성된 댓글' }),
  ApiBadRequestResponse({ type: ErrorResponseDto, description: '유효성 실패' }),
  ApiUnauthorizedResponse({ type: ErrorResponseDto, description: '인증되지 않은 사용자' }),
  ApiNotFoundResponse({ type: ErrorResponseDto, description: '게시글 / 부모 댓글 없음' }),
  ApiInternalServerErrorResponse({ type: ErrorResponseDto, description: '서버 내부 오류' }),
);

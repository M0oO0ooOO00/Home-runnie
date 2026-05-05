import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { FeedCommentResponseDto } from '@/post/feed/comment/dto';
import { ErrorResponseDto } from '@/common';

export const GetFeedCommentsSwagger = applyDecorators(
  ApiOperation({
    summary: '피드 댓글 목록 조회 (1단계 트리)',
    description:
      'root 댓글 + 각 root의 replies(대댓글)을 담은 1단계 트리 응답. 비로그인도 조회 가능.',
  }),
  ApiParam({ name: 'postId', type: Number, example: 1 }),
  ApiOkResponse({ type: [FeedCommentResponseDto], description: '댓글 트리' }),
  ApiNotFoundResponse({ type: ErrorResponseDto, description: '게시글 없음' }),
  ApiInternalServerErrorResponse({ type: ErrorResponseDto, description: '서버 내부 오류' }),
);

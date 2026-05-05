import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '@/common';

export const DeleteFeedCommentSwagger = applyDecorators(
  ApiOperation({
    summary: '피드 댓글 삭제 (soft delete)',
    description: '작성자 본인만 삭제 가능. 대댓글이 달린 root 댓글도 동일 규칙으로 삭제 처리.',
  }),
  ApiParam({ name: 'postId', type: Number, example: 1 }),
  ApiParam({ name: 'commentId', type: Number, example: 10 }),
  ApiOkResponse({
    description: '삭제 성공',
    schema: {
      type: 'object',
      properties: { id: { type: 'number', example: 10 } },
    },
  }),
  ApiBadRequestResponse({ type: ErrorResponseDto, description: '댓글이 다른 게시글 소속' }),
  ApiUnauthorizedResponse({ type: ErrorResponseDto, description: '인증되지 않은 사용자' }),
  ApiForbiddenResponse({ type: ErrorResponseDto, description: '작성자가 아니어서 권한 없음' }),
  ApiNotFoundResponse({ type: ErrorResponseDto, description: '댓글 없음' }),
  ApiInternalServerErrorResponse({ type: ErrorResponseDto, description: '서버 내부 오류' }),
);

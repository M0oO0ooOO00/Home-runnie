import { applyDecorators } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '@/common';

export const DeleteFeedPostSwagger = applyDecorators(
  ApiOperation({
    summary: '피드 게시글 삭제 (soft delete)',
    description: '작성자 본인이 자신의 피드 게시글을 소프트 삭제합니다.',
  }),
  ApiParam({ name: 'postId', type: Number, description: '삭제할 게시글 ID', example: 1 }),
  ApiOkResponse({
    description: '삭제 성공. 삭제된 게시글 ID 반환',
    schema: {
      type: 'object',
      properties: { id: { type: 'number', example: 1 } },
    },
  }),
  ApiUnauthorizedResponse({ type: ErrorResponseDto, description: '인증되지 않은 사용자' }),
  ApiForbiddenResponse({ type: ErrorResponseDto, description: '작성자가 아니어서 권한 없음' }),
  ApiNotFoundResponse({ type: ErrorResponseDto, description: '게시글을 찾을 수 없음' }),
  ApiInternalServerErrorResponse({ type: ErrorResponseDto, description: '서버 내부 오류' }),
);

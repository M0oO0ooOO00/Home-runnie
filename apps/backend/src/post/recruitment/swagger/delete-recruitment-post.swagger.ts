import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '@/common';

export const DeleteRecruitmentPostSwagger = applyDecorators(
  ApiOperation({
    summary: '직관 메이트 모집글 삭제',
    description: '작성자 본인이 자신의 모집 게시글을 소프트 삭제합니다.',
  }),
  ApiParam({
    name: 'postId',
    type: Number,
    description: '삭제할 모집글 ID',
    example: 1,
  }),
  ApiOkResponse({
    description: '삭제 성공. 삭제된 게시글 ID 반환',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
      },
    },
  }),
  ApiUnauthorizedResponse({
    type: ErrorResponseDto,
    description: '인증되지 않은 사용자',
  }),
  ApiForbiddenResponse({
    type: ErrorResponseDto,
    description: '작성자가 아니어서 삭제 권한이 없음',
  }),
  ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: '해당 모집글을 찾을 수 없음',
  }),
  ApiInternalServerErrorResponse({
    type: ErrorResponseDto,
    description: '서버 내부 오류',
  }),
);

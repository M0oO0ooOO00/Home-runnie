import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ToggleLikeResponseDto } from '@/reaction/dto';
import { ReactionTargetType } from '@/reaction/domain';
import { ErrorResponseDto } from '@/common';

export const ToggleLikeSwagger = applyDecorators(
  ApiOperation({
    summary: '좋아요 토글',
    description:
      '대상에 좋아요가 없으면 추가, 있으면 취소(soft delete). 응답으로 현재 상태(liked) + 총 좋아요 수(likeCount).',
  }),
  ApiParam({
    name: 'targetType',
    enum: ReactionTargetType,
    description: '대상 종류 (P1에서는 POST만 지원, COMMENT는 추후)',
    example: ReactionTargetType.POST,
  }),
  ApiParam({
    name: 'targetId',
    type: Number,
    description: '대상 ID',
    example: 1,
  }),
  ApiOkResponse({
    type: ToggleLikeResponseDto,
    description: '토글 후 상태',
  }),
  ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: '지원하지 않는 targetType 등',
  }),
  ApiUnauthorizedResponse({
    type: ErrorResponseDto,
    description: '인증되지 않은 사용자',
  }),
  ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: '대상을 찾을 수 없음',
  }),
  ApiInternalServerErrorResponse({
    type: ErrorResponseDto,
    description: '서버 내부 오류',
  }),
);

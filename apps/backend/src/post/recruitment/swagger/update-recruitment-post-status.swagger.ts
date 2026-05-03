import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import {
  UpdateRecruitmentPostStatusRequestDto,
  UpdateRecruitmentPostStatusResponseDto,
} from '@/post/recruitment/dto';
import { ErrorResponseDto } from '@/common';

export const UpdateRecruitmentPostStatusSwagger = applyDecorators(
  ApiOperation({
    summary: '직관 메이트 모집글 상태 변경',
    description: '작성자 본인이 모집글의 상태를 ACTIVE/CLOSE로 변경합니다.',
  }),
  ApiParam({
    name: 'postId',
    type: Number,
    description: '상태를 변경할 모집글 ID',
    example: 1,
  }),
  ApiBody({
    type: UpdateRecruitmentPostStatusRequestDto,
    description: '변경할 상태 정보',
  }),
  ApiOkResponse({
    type: UpdateRecruitmentPostStatusResponseDto,
    description: '상태 변경 성공',
  }),
  ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: '유효성 검사 실패 (지원하지 않는 상태값 등)',
  }),
  ApiUnauthorizedResponse({
    type: ErrorResponseDto,
    description: '인증되지 않은 사용자',
  }),
  ApiForbiddenResponse({
    type: ErrorResponseDto,
    description: '작성자가 아니어서 변경 권한이 없음',
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

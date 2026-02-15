import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { CreateRecruitmentPostRequestDto, CreateRecruitmentPostResponseDto } from '@/post/dto';
import { ErrorResponseDto } from '@/common';

export const CreateRecruitmentPostSwagger = applyDecorators(
  ApiOperation({
    summary: '직관 메이트 모집글 작성',
    description: '새로운 직관 메이트 모집 게시글을 생성합니다.',
  }),
  ApiBody({
    type: CreateRecruitmentPostRequestDto,
    description: '모집글 작성에 필요한 데이터',
  }),
  ApiCreatedResponse({
    type: CreateRecruitmentPostResponseDto,
    description: '모집글 생성 성공 후 반환하는 데이터',
  }),
  ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: '유효성 검사 실패 (필수 값 누락, 형식 오류 등)',
  }),
  ApiUnauthorizedResponse({
    type: ErrorResponseDto,
    description: '인증되지 않은 사용자',
  }),
  ApiInternalServerErrorResponse({
    type: ErrorResponseDto,
    description: '서버 내부 오류',
  }),
);

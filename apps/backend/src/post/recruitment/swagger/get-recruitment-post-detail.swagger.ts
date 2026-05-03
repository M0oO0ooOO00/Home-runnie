import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { GetRecruitmentPostDetailResponseDto } from '@/post/recruitment/dto';
import { ErrorResponseDto } from '@/common';

export const GetRecruitmentPostDetailSwagger = applyDecorators(
  ApiOperation({
    summary: '직관 메이트 모집글 단건 조회',
    description: 'postId로 단일 모집 게시글의 상세 정보를 조회합니다.',
  }),
  ApiParam({
    name: 'postId',
    type: Number,
    description: '조회할 모집글 ID',
    example: 1,
  }),
  ApiOkResponse({
    type: GetRecruitmentPostDetailResponseDto,
    description: '모집글 상세 조회 성공',
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

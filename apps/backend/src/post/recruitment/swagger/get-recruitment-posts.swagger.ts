import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { GetRecruitmentPostsResponseDto } from '@/post/recruitment/dto';
import { ErrorResponseDto } from '@/common';

export const GetRecruitmentPostsSwagger = applyDecorators(
  ApiOperation({
    summary: '직관 메이트 모집글 목록 조회',
    description:
      '필터(키워드/구장/팀/티켓 상태 등)와 페이지네이션을 적용해 모집글 목록을 조회합니다.',
  }),
  ApiOkResponse({
    type: GetRecruitmentPostsResponseDto,
    description: '모집글 목록 조회 성공',
  }),
  ApiInternalServerErrorResponse({
    type: ErrorResponseDto,
    description: '서버 내부 오류',
  }),
);

import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const CompleteSignUpSwagger = applyDecorators(
  ApiOperation({
    summary: '추가 정보 입력 (회원가입 완료)',
    description: '회원가입 토큰을 통해 추가 정보를 입력하고 회원가입을 완료합니다.',
  }),
  ApiResponse({ status: 201, description: '회원가입 성공' }),
  ApiResponse({ status: 401, description: '회원가입 토큰 유효하지 않음' }),
);

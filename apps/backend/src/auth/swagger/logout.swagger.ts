import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const LogoutSwagger = applyDecorators(
  ApiOperation({
    summary: '로그아웃',
    description: '인증 쿠키를 삭제하여 로그아웃합니다.',
  }),
  ApiResponse({ status: 201, description: '로그아웃 성공' }),
);

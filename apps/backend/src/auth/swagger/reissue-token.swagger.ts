import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const ReissueTokenSwagger = applyDecorators(
  ApiOperation({
    summary: '토큰 재발급',
    description: '리프레시 토큰을 사용하여 액세스 토큰을 재발급합니다.',
  }),
  ApiResponse({ status: 201, description: '토큰 재발급 성공' }),
  ApiResponse({ status: 401, description: '리프레시 토큰 만료 또는 유효하지 않음' }),
);

import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

export const KakaoLoginSwagger = applyDecorators(
  ApiOperation({
    summary: '카카오 로그인',
    description: '카카오 OAuth 로그인을 시작합니다.',
  }),
);

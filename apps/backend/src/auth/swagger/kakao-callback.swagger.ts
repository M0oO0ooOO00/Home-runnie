import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

export const KakaoCallbackSwagger = applyDecorators(
  ApiOperation({
    summary: '카카오 로그인 콜백',
    description:
      '카카오 로그인 성공 후 콜백을 처리합니다. 회원가입 여부에 따라 리다이렉트 경로가 달라집니다.',
  }),
);

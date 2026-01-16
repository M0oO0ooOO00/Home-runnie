import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';

@Injectable()
export class CookieService {
  constructor(private readonly configService: ConfigService) {}

  buildCookie<T>(key: string, data: T, options?: CookieOptions) {
    const isProduction = this.configService.get('NODE_ENV') === 'production';

    const defaultOptions: CookieOptions = {
      // 배포 이후 도메인 설정 바꾸기
      domain: isProduction ? 'example.domain.com' : undefined,
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    };

    return {
      name: key,
      value: data,
      options: { ...defaultOptions, ...options },
    };
  }

  createAccessTokenCookie(token: string) {
    return this.buildCookie('accessToken', token, {
      maxAge: this.configService.get<number>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });
  }

  createRefreshTokenCookie(token: string) {
    return this.buildCookie('refreshToken', token, {
      maxAge: this.configService.get<number>('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    });
  }

  createSignUpTokenCookie(token: string) {
    return this.buildCookie('signUpToken', token, {
      maxAge: this.configService.get<number>('JWT_SIGNUP_TOKEN_EXPIRATION_TIME'),
    });
  }
}

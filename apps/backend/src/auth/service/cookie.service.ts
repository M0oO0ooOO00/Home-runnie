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
}

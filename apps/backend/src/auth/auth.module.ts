import { Module } from '@nestjs/common';
import { JwtStrategy } from './strategies';
import { JwtAuthGuard } from './guards';
import { JwtModule } from '@nestjs/jwt';
import { MemberModule } from 'src/member/member.module';
import { AuthService } from './service/auth.service';
import { AuthController } from './auth.controller';
import { KakaoStrategy } from './strategies/kakao.strategy';
import { TokenService } from './service/token.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CookieService } from './service/cookie.service';
import { AuthFacade } from './service/auth.facade';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    MemberModule,
  ],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    AuthService,
    KakaoStrategy,
    TokenService,
    CookieService,
    AuthFacade,
  ],
  exports: [JwtAuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}

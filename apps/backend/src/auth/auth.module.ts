import { Module } from '@nestjs/common';
import { JwtStrategy } from '@/auth/strategies';
import { JwtAuthGuard } from '@/auth/guards';
import { JwtModule } from '@nestjs/jwt';
import { MemberModule } from '@/member/member.module';
import { AuthService } from '@/auth/service/auth.service';
import { AuthController } from '@/auth/auth.controller';
import { KakaoStrategy } from '@/auth/strategies/kakao.strategy';
import { TokenService } from '@/auth/service/token.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CookieService } from '@/auth/service/cookie.service';
import { AuthFacade } from '@/auth/service/auth.facade';

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

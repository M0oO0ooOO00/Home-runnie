import { Module } from '@nestjs/common';
import { JwtStrategy } from '@/auth/strategies/index.js';
import { JwtAuthGuard } from '@/auth/guards/index.js';
import { JwtModule } from '@nestjs/jwt';
import { MemberModule } from '@/member/member.module.js';
import { AuthService } from '@/auth/auth.service.js';
import { AuthController } from '@/auth/auth.controller.js';
import { KakaoStrategy } from '@/auth/strategies/kakao.strategy.js';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1d' },
        }),
        MemberModule,
    ],
    providers: [JwtStrategy, JwtAuthGuard, AuthService, KakaoStrategy],
    exports: [JwtAuthGuard],
    controllers: [AuthController],
})
export class AuthModule {}

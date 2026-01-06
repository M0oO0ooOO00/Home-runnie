import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { SignUpCompleteRequestDto } from './dto/request/sign-up.complete.request.dto';
import { AuthService } from './service/auth.service';
import { CookieService } from './service/cookie.service';
import { TokenService } from './service/token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly cookieService: CookieService,
    private readonly configService: ConfigService,
  ) {}

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin() {}

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoCallback(@Req() req, @Res() res: Response) {
    const user = req.user;
    const member = await this.authService.validateKakaoLogin(user);
    const frontUrl = this.configService.get<string>('LOCAL_FRONT');

    if (member.signUpStatus === false) {
      this.clearAuthCookies(res);

      const signUpToken = this.tokenService.generateSignUpToken(member.id);
      const signUpCookie = this.cookieService.createSignUpTokenCookie(signUpToken);

      res.cookie(signUpCookie.name, signUpCookie.value, signUpCookie.options);
      res.redirect(`${frontUrl}/signup`);
    } else {
      const token = this.tokenService.generateToken(member);
      this.setAuthCookies(res, token);
      res.redirect(`${frontUrl}/home`);
    }
  }

  @Post('signup')
  async completeSignUp(
    @Body() signUpCompleteRequestDto: SignUpCompleteRequestDto,
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const signUpToken = req.cookies['signUpToken'];

    let memberId: number;
    try {
      const payload = this.tokenService.verifyToken(signUpToken);
      memberId = payload.memberId;
    } catch (error) {
      throw new UnauthorizedException('회원가입 토큰이 없습니다.');
    }

    const member = await this.authService.completeSignUp(memberId, signUpCompleteRequestDto);

    res.clearCookie('signUpToken', { path: '/' });

    const token = this.tokenService.generateToken(member);
    this.setAuthCookies(res, token);

    return { success: true };
  }

  private setAuthCookies(res: Response, token: { accessToken: string; refreshToken: string }) {
    const accessCookie = this.cookieService.createAccessTokenCookie(token.accessToken);
    const refreshCookie = this.cookieService.createRefreshTokenCookie(token.refreshToken);

    res.cookie(accessCookie.name, accessCookie.value, accessCookie.options);
    res.cookie(refreshCookie.name, refreshCookie.value, refreshCookie.options);
  }

  private clearAuthCookies(res: Response) {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
  }
}

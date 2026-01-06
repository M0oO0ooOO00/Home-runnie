import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { SignUpCompleteRequestDto } from './dto/request/sign-up.complete.request.dto';
import { AuthFacade } from './service/auth.facade';
import {
  AuthControllerSwagger,
  CompleteSignUpSwagger,
  KakaoCallbackSwagger,
  KakaoLoginSwagger,
  LogoutSwagger,
  ReissueTokenSwagger,
} from './swagger';

@AuthControllerSwagger
@Controller('auth')
export class AuthController {
  constructor(private readonly authFacade: AuthFacade) {}

  @KakaoLoginSwagger
  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin() {}

  @KakaoCallbackSwagger
  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoCallback(@Req() req, @Res() res: Response) {
    const result = await this.authFacade.handleKakaoLogin(req.user);

    if (result.type === 'SIGN_UP_REQUIRED') {
      this.clearAuthCookies(res);
      res.cookie(result.cookie.name, result.cookie.value, result.cookie.options);
      return res.redirect(result.redirectUrl);
    }

    result.cookies.forEach((c) => res.cookie(c.name, c.value, c.options));
    return res.redirect(result.redirectUrl);
  }

  @CompleteSignUpSwagger
  @Post('signup')
  async completeSignUp(
    @Body() signUpCompleteRequestDto: SignUpCompleteRequestDto,
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const signUpToken = req.cookies['signUpToken'];
    const result = await this.authFacade.handleCompleteSignUp(
      signUpToken,
      signUpCompleteRequestDto,
    );

    res.clearCookie('signUpToken', { path: '/' });
    result.cookies.forEach((c) => res.cookie(c.name, c.value, c.options));

    return { success: true };
  }

  @LogoutSwagger
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    this.clearAuthCookies(res);
    return { success: true };
  }

  @ReissueTokenSwagger
  @Post('/re-issue')
  async reissueToken(@Req() req, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    const accessCookie = await this.authFacade.handleReissueToken(refreshToken);

    res.cookie(accessCookie.name, accessCookie.value, accessCookie.options);

    return { success: true };
  }

  private clearAuthCookies(res: Response) {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
  }
}

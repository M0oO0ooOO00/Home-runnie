import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './service/auth.service';
import * as process from 'node:process';
import { SignUpCompleteRequestDto } from './dto/request/sign-up.complete.request.dto';
import { TokenService } from './service/token.service';
import { Response } from 'express';
import { CookieService } from './service/cookie.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly cookieService: CookieService,
  ) {}

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin() {}

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoCallback(@Req() req, @Res() res: Response) {
    const user = req.user;
    const member = await this.authService.validateKakaoLogin(user);

    if (member.signUpStatus === false) {
      res.clearCookie('accessToken', { path: '/' });
      res.clearCookie('refreshToken', { path: '/' });
      res.redirect(`${process.env.LOCAL_FRONT}/signup?memberId=${member.id}`);
    } else {
      const token = this.tokenService.generateToken(member);

      const accessCookie = this.cookieService.buildCookie('accessToken', token.accessToken, {
        maxAge: 24 * 60 * 60 * 1000,
      });
      const refreshCookie = this.cookieService.buildCookie('refreshToken', token.refreshToken, {
        maxAge: 24 * 60 * 60 * 1000 * 7,
      });

      res.cookie(accessCookie.name, accessCookie.value, accessCookie.options);
      res.cookie(refreshCookie.name, refreshCookie.value, refreshCookie.options);
      res.redirect(`${process.env.LOCAL_FRONT}/home`);
    }
  }

  @Post('signup')
  async completeSignUp(
    @Body() signUpCompleteRequestDto: SignUpCompleteRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('Received signUp request');
    console.log('DTO:', JSON.stringify(signUpCompleteRequestDto, null, 2));

    const member = await this.authService.completeSignUp(signUpCompleteRequestDto);

    const token = this.tokenService.generateToken(member);

    const accessCookie = this.cookieService.buildCookie('accessToken', token.accessToken, {
      maxAge: 24 * 60 * 60 * 1000,
    });
    const refreshCookie = this.cookieService.buildCookie('refreshToken', token.refreshToken, {
      maxAge: 24 * 60 * 60 * 1000 * 7,
    });

    res.cookie(accessCookie.name, accessCookie.value, accessCookie.options);
    res.cookie(refreshCookie.name, refreshCookie.value, refreshCookie.options);

    return { success: true };
  }
}

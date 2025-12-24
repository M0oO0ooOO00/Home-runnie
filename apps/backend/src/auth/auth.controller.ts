import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './service/auth.service';
import * as process from 'node:process';
import { SignUpCompleteRequestDto } from './dto/request/sign-up.complete.request';
import { TokenService } from './service/token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin() {}

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoCallback(@Req() req, @Res() res) {
    const user = req.user;
    const member = await this.authService.validateKakaoLogin(user);

    if (member.signUpStatus === false) {
      // 최종 회원가입 안된 경우
      res.redirect(`${process.env.LOCAL_FRONT}/signup?memberId=${member.id}`);
    } else {
      // 이미 회원가입이 완료된 계정의 경우
      // 토큰 만들고
      // 홈페이지 리다이렉트
      const token = this.tokenService.generateToken(member);
      console.log(token);
    }
  }

  @Post('signup')
  async completeSignUp(@Body() signUpCompleteRequestDto: SignUpCompleteRequestDto) {
    const member = await this.authService.completeSignUp(signUpCompleteRequestDto);
    console.log('회원 가입 완료');
    // 추후 쿠키 등등으로 변경
    const token = this.tokenService.generateToken(member);
    console.log(token);
  }
}

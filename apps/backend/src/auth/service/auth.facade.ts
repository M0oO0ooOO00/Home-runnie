import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService, KakaoOAuthMember } from './auth.service';
import { TokenService } from './token.service';
import { CookieService } from './cookie.service';
import { SignUpCompleteRequestDto } from '../dto/request/sign-up.complete.request.dto';

@Injectable()
export class AuthFacade {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly cookieService: CookieService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 카카오 로그인 프로세스를 처리합니다.
   * 회원가입 필요 여부에 따라 적절한 리다이렉트 경로와 쿠키 데이터를 반환합니다.
   */
  async handleKakaoLogin(user: KakaoOAuthMember) {
    const member = await this.authService.validateKakaoLogin(user);
    const frontUrl = this.configService.get<string>('LOCAL_FRONT');

    if (member.signUpStatus === false) {
      const signUpToken = this.tokenService.generateSignUpToken(member.id);
      const signUpCookie = this.cookieService.createSignUpTokenCookie(signUpToken);

      return {
        type: 'SIGN_UP_REQUIRED' as const,
        redirectUrl: `${frontUrl}/signup`,
        cookie: signUpCookie,
        clearCookies: ['accessToken', 'refreshToken'], // 기존 인증 쿠키 삭제 필요
      };
    }

    const token = this.tokenService.generateToken(member);
    const accessCookie = this.cookieService.createAccessTokenCookie(token.accessToken);
    const refreshCookie = this.cookieService.createRefreshTokenCookie(token.refreshToken);

    return {
      type: 'LOGIN_SUCCESS' as const,
      redirectUrl: `${frontUrl}/home`,
      cookies: [accessCookie, refreshCookie],
    };
  }

  /**
   * 추가 정보를 입력받아 회원가입을 완료합니다.
   */
  async handleCompleteSignUp(signUpToken: string, dto: SignUpCompleteRequestDto) {
    if (!signUpToken) {
      throw new UnauthorizedException('회원가입 토큰이 없습니다.');
    }

    let memberId: number;
    try {
      const payload = this.tokenService.verifySignUpToken(signUpToken);
      memberId = payload.memberId;
    } catch (error) {
      throw new UnauthorizedException('유효하지 않은 회원가입 토큰입니다.');
    }

    const member = await this.authService.completeSignUp(memberId, dto);
    const token = this.tokenService.generateToken(member);

    const accessCookie = this.cookieService.createAccessTokenCookie(token.accessToken);
    const refreshCookie = this.cookieService.createRefreshTokenCookie(token.refreshToken);

    return {
      success: true,
      cookies: [accessCookie, refreshCookie],
      clearCookies: ['signUpToken'],
    };
  }

  /**
   * 리프레시 토큰을 이용해 액세스 토큰을 재발급합니다.
   */
  async handleReissueToken(refreshToken: string) {
    const accessToken = await this.tokenService.reissueToken(refreshToken);
    return this.cookieService.createAccessTokenCookie(accessToken);
  }

  /**
   * 로그아웃 시 제거해야 할 쿠키 정보를 반환합니다.
   */
  handleLogout() {
    return {
      clearCookies: ['accessToken', 'refreshToken'],
    };
  }
}

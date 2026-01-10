import { Test } from '@nestjs/testing';
import { AuthFacade } from '@/auth/service/auth.facade';
import { AuthService } from '@/auth/service/auth.service';
import { CookieService } from '@/auth/service/cookie.service';
import { TokenService } from '@/auth/service/token.service';
import { ConfigService } from '@nestjs/config';
import { OAuthProvider, Role, Team } from '@/common';
import { MemberType } from '@/member/domain';
import { Gender, SignupCompleteRequest } from '@homerunnie/shared';
import { SignUpCompleteRequestDto } from '@/auth/dto/request/sign-up.complete.request.dto';
import { SignUpTokenPayload } from '@/auth/types';

describe('AuthFacade', () => {
  let authFacade: AuthFacade;
  let authService: AuthService;
  let tokenService: TokenService;
  let cookieService: CookieService;

  const mockAuthService = {
    validateKakaoLogin: jest.fn(),
    completeSignUp: jest.fn(),
  };

  const mockTokenService = {
    generateToken: jest.fn(),
    generateSignUpToken: jest.fn(),
    verifyAccessToken: jest.fn(),
    verifyRefreshToken: jest.fn(),
    verifySignUpToken: jest.fn(),
  };

  const mockCookieService = {
    createAccessTokenCookie: jest.fn(),
    createRefreshTokenCookie: jest.fn(),
    createSignUpTokenCookie: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthFacade,
        { provide: AuthService, useValue: mockAuthService },
        { provide: TokenService, useValue: mockTokenService },
        { provide: CookieService, useValue: mockCookieService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    authFacade = module.get<AuthFacade>(AuthFacade);
    authService = module.get<AuthService>(AuthService);
    tokenService = module.get<TokenService>(TokenService);
    cookieService = module.get<CookieService>(CookieService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authFacade).toBeDefined();
  });

  describe('handleKakaoLogin', () => {
    const mockKakaoOauthUser = {
      snsId: '123',
      email: 'test@gmail.com',
      name: '테스트',
      provider: OAuthProvider.KAKAO,
    };

    const mockMember = {
      id: 1,
      role: Role.USER,
      signUpStatus: false,
    } as MemberType;

    const mockSignedMember = {
      id: 1,
      role: Role.USER,
      signUpStatus: true,
    } as MemberType;

    it('회원 가입이 되어있지 않은 경우 회원으로 등록하고 추가 회원가입 창으로 리다이렉트한다.', async () => {
      // given
      mockAuthService.validateKakaoLogin.mockResolvedValue(mockMember);
      mockConfigService.get.mockReturnValue('https://test.com');
      mockTokenService.generateSignUpToken.mockReturnValue('sign-up-token');
      mockCookieService.createSignUpTokenCookie.mockReturnValue(mockMember);

      // when
      const result = await authFacade.handleKakaoLogin(mockKakaoOauthUser);

      // then
      expect(result.type).toEqual('SIGN_UP_REQUIRED');
      expect(result.redirectUrl).toEqual('https://test.com/signup');
    });

    it('이미 회원가입이 되어있는 회원이 카카오 로그인을 진행하는 경우 accessToken과 refreshToken을 생성한다.', async () => {
      // given
      const mockTokens = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
      };
      const mockCookies = {
        access: 'access-cookie',
        refresh: 'refresh-cookie',
      };

      mockAuthService.validateKakaoLogin.mockResolvedValue(mockSignedMember);
      mockConfigService.get.mockReturnValue('http://test.com');
      mockTokenService.generateToken.mockReturnValue(mockTokens);
      mockCookieService.createAccessTokenCookie.mockReturnValue(mockCookies.access);
      mockCookieService.createRefreshTokenCookie.mockReturnValue(mockCookies.refresh);

      // when
      const result = await authFacade.handleKakaoLogin(mockKakaoOauthUser);

      // then
      expect(result.type).toEqual('LOGIN_SUCCESS');
      expect(result.redirectUrl).toEqual('http://test.com/home');
      expect(result.cookies).toContain(mockCookies.access);
      expect(result.cookies).toContain(mockCookies.refresh);
      expect(mockTokenService.generateToken).toHaveBeenCalledWith(mockSignedMember);
    });
  });

  describe('handleCompleteSignUp', () => {
    const mockSignUpRequestDto = {
      nickName: '테스트',
      phoneNumber: '010-1234-5678',
      birthDate: '2000-01-01',
      gender: Gender.MALE,
      supportTeam: Team.DOOSAN,
    };

    const signUpTokenPayload = {
      memberId: 1,
      role: Role.USER,
    } as SignUpTokenPayload;

    const mockSignUpToken = 'test-sign-up-token';

    it('추가 정보를 받아 최종 회원가입을 완료한다', async () => {
      // given
      const mockMember = { id: 1, role: Role.USER, signUpStatus: true } as MemberType;
      const mockTokens = { accessToken: 'access', refreshToken: 'refresh' };
      const mockCookies = { access: 'access-cookie', refresh: 'refresh-cookie' };

      mockTokenService.verifySignUpToken.mockReturnValue(signUpTokenPayload);
      mockAuthService.completeSignUp.mockResolvedValue(mockMember);
      mockTokenService.generateToken.mockReturnValue(mockTokens);
      mockCookieService.createAccessTokenCookie.mockReturnValue(mockCookies.access);
      mockCookieService.createRefreshTokenCookie.mockReturnValue(mockCookies.refresh);

      // when
      const result = await authFacade.handleCompleteSignUp(
        mockSignUpToken,
        mockSignUpRequestDto as SignUpCompleteRequestDto,
      );

      // then
      expect(result.success).toBe(true);
      expect(result.cookies).toContain(mockCookies.access);
      expect(result.cookies).toContain(mockCookies.refresh);
      expect(result.clearCookies).toContain('signUpToken');
      expect(mockAuthService.completeSignUp).toHaveBeenCalledWith(
        signUpTokenPayload.memberId,
        mockSignUpRequestDto,
      );
      expect(mockTokenService.generateToken).toHaveBeenCalledWith(mockMember);
    });

    it('signUpToken이 없는 경우 UnauthorizedException을 던진다', async () => {
      // when & then
      await expect(
        authFacade.handleCompleteSignUp(
          null as unknown as string,
          mockSignUpRequestDto as SignUpCompleteRequestDto,
        ),
      ).rejects.toThrow('회원가입 토큰이 없습니다.');
    });

    it('유효하지 않은 signUpToken인 경우 UnauthorizedException을 던진다', async () => {
      // given
      mockTokenService.verifySignUpToken.mockImplementation(() => {
        throw new Error('invalid token');
      });

      // when & then
      await expect(
        authFacade.handleCompleteSignUp(
          'invalid-token',
          mockSignUpRequestDto as SignUpCompleteRequestDto,
        ),
      ).rejects.toThrow('유효하지 않은 회원가입 토큰입니다.');
    });
  });

  describe('handleLogout', () => {
    it('로그아웃 시 제거해야 할 쿠키 이름을 반환한다', () => {
      const result = authFacade.handleLogout();
      expect(result.clearCookies).toContain('accessToken');
      expect(result.clearCookies).toContain('refreshToken');
    });
  });
});

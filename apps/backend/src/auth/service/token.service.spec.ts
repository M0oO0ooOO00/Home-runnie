import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MemberRepository } from 'src/member/repository';
import { TokenService } from './token.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from 'src/common';
import { MemberType } from 'src/member/domain';

describe('TokenService', () => {
  let tokenService: TokenService;
  let jwtService: JwtService;

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'JWT_SECRET') return 'test-secret';
      if (key === 'JWT_ACCESS_TOKEN_EXPIRATION_TIME') return 3600;
      if (key === 'JWT_REFRESH_TOKEN_EXPIRATION_TIME') return 7200;
      if (key === 'JWT_SIGNUP_TOKEN_EXPIRATION_TIME') return 60;
      return null;
    }),
  };

  const mockMemberRepository = {
    findOneById: jest.fn(),
  };

  beforeEach(async () => {
    // 2. NestJS 테스트 모듈 생성 (의존성 주입 처리)
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: MemberRepository, useValue: mockMemberRepository },
      ],
    }).compile();
    tokenService = module.get<TokenService>(TokenService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    const mockMember = {
      id: 1,
      role: Role.USER,
    } as MemberType;

    it('성공적으로 accessToken과 refreshToken을 생성하여야 한다.', () => {
      // given
      mockJwtService.sign
        .mockReturnValueOnce('test-access-token')
        .mockReturnValueOnce('test-refresh-token');

      // when
      const result = tokenService.generateToken(mockMember);

      // then
      expect(result.accessToken).toBe('test-access-token');
      expect(result.refreshToken).toBe('test-refresh-token');

      // access token 생성시 payload 확인
      expect(jwtService.sign).toHaveBeenCalledWith(
        { memberId: mockMember.id, role: mockMember.role },
        {
          secret: 'test-secret',
          expiresIn: 3600,
        },
      );

      // refresh token 생성시 payload 확인
      expect(jwtService.sign).toHaveBeenCalledWith(
        { memberId: mockMember.id },
        {
          secret: 'test-secret',
          expiresIn: 7200,
        },
      );
    });
  });

  describe('generateSignUpToken', () => {
    const mockMemberId = 1;

    it('성공적으로 회원가입을 위한 토큰을 생성하여야 한다', () => {
      // given
      mockJwtService.sign.mockReturnValueOnce('test-signup-token');

      // when
      const result = tokenService.generateSignUpToken(mockMemberId);

      // then
      expect(result).toBe('test-signup-token');

      expect(jwtService.sign).toHaveBeenCalledWith(
        { memberId: mockMemberId },
        {
          secret: 'test-secret',
          expiresIn: 60,
        },
      );
    });
  });

  describe('reIssueTokenService', () => {
    const mockRefreshToken = 'test-refresh-token';
    const mockMember = {
      id: 1,
      role: Role.USER,
    } as MemberType;

    it('성공적으로 refreshToken을 사용하여 accessToken을 재발급 받는다.', async () => {
      // given
      mockJwtService.verify.mockReturnValueOnce({ memberId: mockMember.id });
      mockMemberRepository.findOneById.mockResolvedValueOnce(mockMember);
      mockJwtService.sign.mockReturnValueOnce('test-access-token');

      // when
      const result = await tokenService.reissueToken(mockRefreshToken);

      // then
      expect(result).toBe('test-access-token');

      expect(mockJwtService.sign).toHaveBeenCalledWith(
        { memberId: mockMember.id, role: mockMember.role },
        {
          secret: 'test-secret',
          expiresIn: 3600,
        },
      );
    });

    it('refresh token이 누락된 경우 UnAthorizatedError가 발생한다', async () => {
      // given
      const wrongRefreshToken = '';

      // when & then
      await expect(tokenService.reissueToken(wrongRefreshToken)).rejects.toThrow(
        '리프레시 토큰이 없습니다.',
      );
    });

    it('refreshToken을 통해 조회된 회원이 없는 경우 오류가 발생한다', async () => {
      // given
      mockJwtService.verify.mockReturnValueOnce({ memberId: mockMember.id });
      mockMemberRepository.findOneById.mockResolvedValueOnce(null);

      // when & then
      await expect(tokenService.reissueToken(mockRefreshToken)).rejects.toThrow(
        '회원 정보를 찾을 수 없습니다.',
      );
    });
  });
});

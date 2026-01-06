import { Test, TestingModule } from '@nestjs/testing';
import { AuthService, KakaoOAuthMember } from './auth.service';
import { MemberRepository } from 'src/member/repository';
import { OAuthProvider, Role } from '../../common';
import { SignUpCompleteRequestDto } from '../dto/request/sign-up.complete.request.dto';
import { Gender, Team } from '@homerunnie/shared';

describe('AuthService', () => {
  let service: AuthService;
  let memberRepository: MemberRepository;

  // MockMemberRepository 제작 (Mockito의 mock() 역할)
  const mockMemberRepository = {
    findOneByEmailAndProvider: jest.fn(),
    create: jest.fn(),
    findOneById: jest.fn(),
    updateTempMemberInfo: jest.fn(),
    createProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: MemberRepository,
          useValue: mockMemberRepository, // 의존성 주입 대상에 mock 객체를 제공
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    memberRepository = module.get<MemberRepository>(MemberRepository);
  });

  afterEach(() => {
    jest.clearAllMocks(); // 각 테스트가 끝날 때마다 mock 호출 기록을 초기화해줍니다.
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateKakaoLogin', () => {
    const mockKakaoUser: KakaoOAuthMember = {
      snsId: '12345',
      email: 'test@kakao.com',
      name: '테스터',
      provider: OAuthProvider.KAKAO,
    };

    it('기존 회원이 존재하면, 새로운 회원을 생성하지 않고 해당 회원을 반환한다', async () => {
      // Given: Mockito의 when(...).thenReturn(...) 과 유사하게 동작을 정의합니다.
      const existingMember = {
        id: 1,
        email: mockKakaoUser.email,
        provider: mockKakaoUser.provider,
      };
      mockMemberRepository.findOneByEmailAndProvider.mockResolvedValue(existingMember);

      // When
      const result = await service.validateKakaoLogin(mockKakaoUser);

      // Then
      expect(result).toEqual(existingMember);
      expect(memberRepository.findOneByEmailAndProvider).toHaveBeenCalledWith(
        mockKakaoUser.email,
        mockKakaoUser.provider,
      );
      // create가 호출되지 않았는지 검증
      expect(memberRepository.create).not.toHaveBeenCalled();
    });

    it('회원이 존재하지 않으면, 새로운 회원을 생성하고 반환한다', async () => {
      // Given
      mockMemberRepository.findOneByEmailAndProvider.mockResolvedValue(null);
      const newMember = { id: 2, email: mockKakaoUser.email, provider: mockKakaoUser.provider };
      mockMemberRepository.create.mockResolvedValue(newMember);

      // When
      const result = await service.validateKakaoLogin(mockKakaoUser);

      // Then
      expect(result).toEqual(newMember);
      expect(memberRepository.findOneByEmailAndProvider).toHaveBeenCalledWith(
        mockKakaoUser.email,
        mockKakaoUser.provider,
      );
      // create가 올바른 인자들과 함께 호출되었는지 검증
      expect(memberRepository.create).toHaveBeenCalledWith(
        mockKakaoUser.name,
        mockKakaoUser.email,
        Role.USER,
        mockKakaoUser.provider,
      );
    });
  });

  describe('completeSignUp', () => {
    const completeSignUpRequestDto: SignUpCompleteRequestDto = {
      birthDate: '2000-01-01',
      phoneNumber: '01012345678',
      gender: Gender.MALE,
      nickName: '테스터',
      supportTeam: Team.DOOSAN,
    };

    const test_member = {
      id: 1,
      email: 'test@kakao.com',
      provider: OAuthProvider.KAKAO,
      name: '테스터',
    };

    it('추가정보를 받아 성공적으로 회원가입에 성공한다.', async () => {
      // given
      mockMemberRepository.findOneById.mockResolvedValue(test_member);
      mockMemberRepository.updateTempMemberInfo.mockResolvedValue(undefined); // void 리턴
      mockMemberRepository.createProfile.mockResolvedValue(undefined); // void 리턴

      // when
      const result = await service.completeSignUp(test_member.id, completeSignUpRequestDto);

      // then
      expect(result).toEqual(test_member);

      // 1. findOneById가 올바른 ID로 호출되었는지 확인
      expect(memberRepository.findOneById).toHaveBeenCalledWith(test_member.id);

      // 2. updateTempMemberInfo가 올바른 인자들로 호출되었는지 확인
      expect(memberRepository.updateTempMemberInfo).toHaveBeenCalledWith(
        test_member.id,
        completeSignUpRequestDto.birthDate,
        completeSignUpRequestDto.phoneNumber,
        completeSignUpRequestDto.gender,
      );

      // 3. createProfile이 DTO 전체가 아니라 필드별로 호출되었는지 확인 (서비스 코드 구현에 맞춤)
      expect(memberRepository.createProfile).toHaveBeenCalledWith(
        test_member.id,
        completeSignUpRequestDto.nickName,
        completeSignUpRequestDto.supportTeam,
      );
    });

    it('회원이 존재하지 않으면 추가 회원가입을 진행하지 못한다', () => {
      // given
      mockMemberRepository.findOneById.mockResolvedValue(null);

      // when & then
      expect(service.completeSignUp(test_member.id, completeSignUpRequestDto)).rejects.toThrow(
        '해당 멤버가 존재하지 않습니다.',
      );
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { MemberController } from '@/member/controller/member.controller';
import { MemberService } from '@/member/service';

describe('MemberController', () => {
  let controller: MemberController;
  let mockMemberService: jest.Mocked<MemberService>;

  beforeEach(async () => {
    mockMemberService = {
      createMember: jest.fn(),
      getMyProfile: jest.fn(),
      updateMyProfile: jest.fn(),
      getMyScrappedRecruitments: jest.fn(),
      getMyWrittenRecruitments: jest.fn(),
      getMyParticipatedRecruitments: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [
        {
          provide: MemberService,
          useValue: mockMemberService,
        },
      ],
    }).compile();

    controller = module.get<MemberController>(MemberController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getMyProfile when getMyInfo is called', async () => {
    const memberId = 1;
    const mockProfile = {
      id: memberId,
      nickname: 'Test User',
    };

    mockMemberService.getMyProfile.mockResolvedValue(mockProfile as any);

    const result = await controller.getMyInfo(memberId);

    expect(mockMemberService.getMyProfile).toHaveBeenCalledWith(memberId);
    expect(result).toEqual(mockProfile);
  });
});

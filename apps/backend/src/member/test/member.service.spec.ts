import { Test } from '@nestjs/testing';
import { MemberService } from '../service';
import { MemberRepository } from '../repository';
import { PaginationService } from '../../common/service/pagination.service';
import { WarnService } from '../../warn/service/warn.service';

describe('MemberService', () => {
  let service: MemberService;
  let mockMemberRepository: jest.Mocked<MemberRepository>;
  let mockPaginationService: jest.Mocked<PaginationService>;
  let mockWarnService: jest.Mocked<WarnService>;

  beforeEach(async () => {
    mockMemberRepository = {
      findAllByPageWithDetails: jest.fn(),
      count: jest.fn(),
      findOneById: jest.fn(),
      findMemberWithProfile: jest.fn(),
      findWarnRecordsByMemberId: jest.fn(),
      findReportingRecordsByMemberId: jest.fn(),
      findReportedRecordsByMemberId: jest.fn(),
      getMemberStatistics: jest.fn(),
      updateProfile: jest.fn(),
      findScrappedRecruitmentsByMemberId: jest.fn(),
      countScrappedRecruitmentsByMemberId: jest.fn(),
      findWrittenRecruitmentsByMemberId: jest.fn(),
      countWrittenRecruitmentsByMemberId: jest.fn(),
      findParticipatedRecruitmentsByMemberId: jest.fn(),
      countParticipatedRecruitmentsByMemberId: jest.fn(),
    } as any;

    mockPaginationService = {
      createResponse: jest.fn(),
    } as any;

    mockWarnService = {
      findByMemberId: jest.fn(),
    } as any;

    const module = await Test.createTestingModule({
      providers: [
        MemberService,
        {
          provide: MemberRepository,
          useValue: mockMemberRepository,
        },
        {
          provide: PaginationService,
          useValue: mockPaginationService,
        },
        {
          provide: WarnService,
          useValue: mockWarnService,
        },
      ],
    }).compile();

    service = module.get(MemberService);
  });

  describe('findAllByPage', () => {
    it('should return paginated member list', async () => {
      const mockMembers = [
        {
          id: 1,
          nickname: 'Test User',
          warningCount: 0,
          reportingCount: 0,
          reportedCount: 0,
          joinedAt: new Date(),
          accountStatus: 'ACTIVE',
        },
      ];

      const mockCount = [{ count: 1 }];

      mockMemberRepository.findAllByPageWithDetails.mockResolvedValue(mockMembers as any);
      mockMemberRepository.count.mockResolvedValue(mockCount);

      const result = await service.findAllByPage(1, 10);

      expect(mockMemberRepository.findAllByPageWithDetails).toHaveBeenCalledWith(1, 10);
      expect(mockMemberRepository.count).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
    });

    it('should use default page size when not provided', async () => {
      const mockMembers: any[] = [];
      const mockCount = [{ count: 0 }];

      mockMemberRepository.findAllByPageWithDetails.mockResolvedValue(mockMembers);
      mockMemberRepository.count.mockResolvedValue(mockCount);

      await service.findAllByPage();

      expect(mockMemberRepository.findAllByPageWithDetails).toHaveBeenCalledWith(1, 10);
    });
  });
});

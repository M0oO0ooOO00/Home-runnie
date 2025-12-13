import { Test } from '@nestjs/testing';
import { MemberService } from '../service';
import { MemberRepository } from '../repository';

describe('MemberService', () => {
    let service: MemberService;

    const mockMemberRepository = {
        findAll: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                MemberService,
                {
                    provide: MemberRepository,
                    useValue: mockMemberRepository,
                },
            ],
        }).compile();

        service = module.get(MemberService);
    });
});

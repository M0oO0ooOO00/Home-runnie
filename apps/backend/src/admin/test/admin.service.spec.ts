import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from '@/admin/service/admin.service.js';
import { MemberService } from '@/member/service/member.service.js';

describe('AdminService', () => {
    let service: AdminService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AdminService,
                { provide: MemberService, useValue: {} },
            ],
        }).compile();

        service = module.get<AdminService>(AdminService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

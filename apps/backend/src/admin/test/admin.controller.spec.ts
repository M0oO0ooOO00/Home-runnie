import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from '@/admin/controller/admin.controller.js';
import { AdminService } from '@/admin/service/admin.service.js';
import { MemberService } from '@/member/service/member.service.js';

describe('AdminController', () => {
    let controller: AdminController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AdminController],
            providers: [
                { provide: AdminService, useValue: {} },
                { provide: MemberService, useValue: {} },
            ],
        }).compile();

        controller = module.get<AdminController>(AdminController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});

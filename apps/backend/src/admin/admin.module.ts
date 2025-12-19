import { Module } from '@nestjs/common';
import { AdminService } from '@/admin/service/index.js';
import { AdminController } from '@/admin/controller/index.js';
import { MemberModule } from '@/member/member.module.js';
import { PaginationService } from '@/common/index.js';
import { WarnModule } from '@/warn/warn.module.js';

@Module({
    imports: [MemberModule, WarnModule],
    controllers: [AdminController],
    providers: [AdminService, PaginationService],
})
export class AdminModule {}

import { Module } from '@nestjs/common';
import { MemberService } from '@/member/service/index.js';
import { MemberController } from '@/member/controller/index.js';
import { MemberRepository } from '@/member/repository/index.js';
import { DbModule } from '@/common/db/db.module.js';
import { ReportModule } from '@/report/report.module.js';
import { PaginationService } from '@/common/service/index.js';
import { WarnModule } from '@/warn/warn.module.js';

@Module({
    imports: [DbModule, ReportModule, WarnModule],
    providers: [MemberService, MemberRepository, PaginationService],
    exports: [MemberService, MemberRepository],
    controllers: [MemberController],
})
export class MemberModule {}

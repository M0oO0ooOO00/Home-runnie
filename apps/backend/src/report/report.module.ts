import { Module } from '@nestjs/common';
import { ReportRepository } from '@/report/repository/index.js';
import { DbModule } from '@/common/db/db.module.js';

@Module({
    imports: [DbModule],
    providers: [ReportRepository],
    exports: [ReportRepository],
})
export class ReportModule {}

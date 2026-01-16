import { Module } from '@nestjs/common';
import { ReportRepository } from '@/report/repository';
import { DbModule } from '@/common/db/db.module';

@Module({
  imports: [DbModule],
  providers: [ReportRepository],
  exports: [ReportRepository],
})
export class ReportModule {}

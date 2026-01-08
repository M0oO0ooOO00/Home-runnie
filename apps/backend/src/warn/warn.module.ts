import { Module } from '@nestjs/common';
import { WarnService } from '@/warn/service';
import { WarnRepository } from '@/warn/repository';
import { DbModule } from '@/common/db/db.module';

@Module({
  imports: [DbModule],
  providers: [WarnService, WarnRepository],
  exports: [WarnService],
})
export class WarnModule {}

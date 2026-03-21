import { Module } from '@nestjs/common';
import { ScrapRepository } from '@/scrap/repository';
import { ScrapService } from '@/scrap/service';
import { ScrapController } from '@/scrap/controller';
import { DbModule } from '@/common/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [ScrapController],
  providers: [ScrapRepository, ScrapService],
  exports: [ScrapRepository],
})
export class ScrapModule {}

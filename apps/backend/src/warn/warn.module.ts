import { Module } from '@nestjs/common';
import { WarnService } from '@/warn/service/index.js';
import { WarnRepository } from '@/warn/repository/index.js';
import { DbModule } from '@/common/db/db.module.js';

@Module({
    imports: [DbModule],
    providers: [WarnService, WarnRepository],
    exports: [WarnService],
})
export class WarnModule {}

import { Module } from '@nestjs/common';
import { ReactionController } from '@/reaction/controller';
import { ReactionService } from '@/reaction/service';
import { ReactionRepository } from '@/reaction/repository';
import { DbModule } from '@/common/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [ReactionController],
  providers: [ReactionService, ReactionRepository],
  exports: [ReactionRepository],
})
export class ReactionModule {}

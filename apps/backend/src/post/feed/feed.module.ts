import { Module } from '@nestjs/common';
import { FeedController } from '@/post/feed/controller';
import { FeedService } from '@/post/feed/service';
import { FeedRepository } from '@/post/feed/repository';
import { DbModule } from '@/common/db/db.module';
import { ReactionModule } from '@/reaction/reaction.module';

@Module({
  imports: [DbModule, ReactionModule],
  controllers: [FeedController],
  providers: [FeedService, FeedRepository],
})
export class FeedModule {}

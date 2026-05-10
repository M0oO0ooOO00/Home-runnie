import { Module } from '@nestjs/common';
import { FeedController } from '@/post/feed/controller';
import { FeedService } from '@/post/feed/service';
import { FeedRepository } from '@/post/feed/repository';
import { FeedCommentController } from '@/post/feed/comment/controller';
import { FeedCommentService } from '@/post/feed/comment/service';
import { FeedCommentRepository } from '@/post/feed/comment/repository';
import { DbModule } from '@/common/db/db.module';
import { ReactionModule } from '@/reaction/reaction.module';
import { PostSharedModule } from '@/post/shared/post-shared.module';

@Module({
  imports: [DbModule, ReactionModule, PostSharedModule],
  controllers: [FeedController, FeedCommentController],
  providers: [FeedService, FeedRepository, FeedCommentService, FeedCommentRepository],
})
export class FeedModule {}

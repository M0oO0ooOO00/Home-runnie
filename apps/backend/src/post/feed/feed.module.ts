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
import { ReactionRepository } from '@/reaction/repository';
import { PostSharedRepository } from '@/post/shared/repository';
import {
  FEED_POST_DELETER,
  FEED_POST_READER,
  FEED_POST_WRITER,
  FEED_REACTION_READER,
  type FeedPostDeleter,
  type FeedReactionReader,
} from '@/post/feed/port';
import {
  FEED_COMMENT_COUNTER,
  FEED_COMMENT_READER,
  FEED_COMMENT_WRITER,
} from '@/post/feed/comment/port';

@Module({
  imports: [DbModule, ReactionModule, PostSharedModule],
  controllers: [FeedController, FeedCommentController],
  providers: [
    FeedService,
    FeedRepository,
    FeedCommentService,
    FeedCommentRepository,
    { provide: FEED_POST_READER, useExisting: FeedRepository },
    { provide: FEED_POST_WRITER, useExisting: FeedRepository },
    { provide: FEED_COMMENT_COUNTER, useExisting: FeedCommentRepository },
    { provide: FEED_COMMENT_READER, useExisting: FeedCommentRepository },
    { provide: FEED_COMMENT_WRITER, useExisting: FeedCommentRepository },
    {
      provide: FEED_REACTION_READER,
      useFactory: (reactionRepository: ReactionRepository): FeedReactionReader =>
        reactionRepository,
      inject: [ReactionRepository],
    },
    {
      provide: FEED_POST_DELETER,
      useFactory: (postSharedRepository: PostSharedRepository): FeedPostDeleter =>
        postSharedRepository,
      inject: [PostSharedRepository],
    },
  ],
})
export class FeedModule {}

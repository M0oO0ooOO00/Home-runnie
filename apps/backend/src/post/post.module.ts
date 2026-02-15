import { Module } from '@nestjs/common';
import { PostController } from '@/post/controller';
import { PostService } from '@/post/service';
import { PostRepository } from '@/post/repository';
import { DbModule } from '@/common/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [PostController],
  providers: [PostService, PostRepository],
  exports: [PostService],
})
export class PostModule {}

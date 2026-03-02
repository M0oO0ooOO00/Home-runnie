import { Module } from '@nestjs/common';
import { DbModule } from '@/common/db/db.module';
import { CommentController } from '@/comment/controller';
import { CommentRepository } from '@/comment/repository';
import { CommentService } from '@/comment/service';

@Module({
  imports: [DbModule],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
  exports: [CommentService],
})
export class CommentModule {}

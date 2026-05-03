import { Module } from '@nestjs/common';
import { DbModule } from '@/common/db/db.module';
import { PostSharedRepository } from '@/post/shared/repository';

@Module({
  imports: [DbModule],
  providers: [PostSharedRepository],
  exports: [PostSharedRepository],
})
export class PostSharedModule {}

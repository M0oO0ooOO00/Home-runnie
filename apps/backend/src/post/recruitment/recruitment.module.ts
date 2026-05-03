import { Module } from '@nestjs/common';
import { RecruitmentController } from '@/post/recruitment/controller';
import { RecruitmentService } from '@/post/recruitment/service';
import { RecruitmentRepository } from '@/post/recruitment/repository';
import { DbModule } from '@/common/db/db.module';
import { PostSharedModule } from '@/post/shared/post-shared.module';

@Module({
  imports: [DbModule, PostSharedModule],
  controllers: [RecruitmentController],
  providers: [RecruitmentService, RecruitmentRepository],
})
export class RecruitmentModule {}

import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from '@/common/interceptors';
import { HttpExceptionFilter } from '@/common/filters';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from '@/common/db/db.module';
import { MemberModule } from '@/member/member.module';
import { AuthModule } from '@/auth/auth.module';
import { ReportModule } from '@/report/report.module';
import { RecruitmentModule } from '@/post/recruitment/recruitment.module';
import { FeedModule } from '@/post/feed/feed.module';
import { ReactionModule } from '@/reaction/reaction.module';
import { ParticipationModule } from '@/participation/participation.module';
import { ScrapModule } from '@/scrap/scrap.module';
import { AdminModule } from '@/admin/admin.module';
import { WarnModule } from '@/warn/warn.module';
import { ChatModule } from '@/chat/chat.module';
import { CommentModule } from '@/comment/comment.module';
import { HealthModule } from '@/health/health.module';
import { UploadModule } from '@/upload';
import databaseConfig from '@/common/config/database.config';
import storageConfig from '@/common/config/storage.config';
import * as path from 'path';

const NODE_ENV = process.env.NODE_ENV ?? 'development';
const SECRET_DIR = path.resolve(process.cwd(), 'secret');

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [path.join(SECRET_DIR, `.env.${NODE_ENV}`), path.join(SECRET_DIR, '.env')],
      isGlobal: true,
      load: [databaseConfig, storageConfig],
    }),
    DbModule,
    WarnModule,
    MemberModule,
    AuthModule,
    ReportModule,
    RecruitmentModule,
    FeedModule,
    ReactionModule,
    ParticipationModule,
    ScrapModule,
    AdminModule,
    ChatModule,
    CommentModule,
    HealthModule,
    UploadModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class AppModule {}

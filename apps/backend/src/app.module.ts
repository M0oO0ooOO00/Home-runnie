import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from '@/common/interceptors/index.js';
import { HttpExceptionFilter } from '@/common/filters/index.js';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from '@/common/db/db.module.js';
import { MemberModule } from '@/member/member.module.js';
import { AuthModule } from '@/auth/auth.module.js';
import { ReportModule } from '@/report/report.module.js';
import { PostModule } from '@/post/post.module.js';
import { ParticipationModule } from '@/participation/participation.module.js';
import { ScrapModule } from '@/scrap/scrap.module.js';
import { AdminModule } from '@/admin/admin.module.js';
import { WarnModule } from '@/warn/warn.module.js';
import databaseConfig from '@/common/config/database.config.js';
import * as path from 'path';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [path.resolve(process.cwd(), 'secret/.env')],
            isGlobal: true,
            load: [databaseConfig],
        }),
        DbModule,
        WarnModule,
        MemberModule,
        AuthModule,
        ReportModule,
        PostModule,
        ParticipationModule,
        ScrapModule,
        AdminModule,
    ],
    providers: [
        { provide: APP_FILTER, useClass: HttpExceptionFilter },
        { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import storageConfig from '@/common/config/storage.config';
import { UploadController } from '@/upload/upload.controller';
import { UploadService } from '@/upload/upload.service';

@Module({
  imports: [ConfigModule.forFeature(storageConfig)],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}

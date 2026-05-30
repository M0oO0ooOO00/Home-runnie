import { BadRequestException, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import storageConfig from '@/common/config/storage.config';
import { UploadController } from '@/upload/upload.controller';
import { UploadService } from '@/upload/upload.service';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 4;
const ALLOWED_MIME = /^image\/(png|jpe?g|gif|webp|heic|heif)$/i;

@Module({
  imports: [
    ConfigModule.forFeature(storageConfig),
    MulterModule.register({
      storage: memoryStorage(),
      limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILES },
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_MIME.test(file.mimetype)) {
          cb(new BadRequestException('이미지 파일만 업로드할 수 있습니다.'), false);
          return;
        }
        cb(null, true);
      },
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}

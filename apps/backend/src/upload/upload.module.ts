import { BadRequestException, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { S3Client } from '@aws-sdk/client-s3';
import * as multerS3 from 'multer-s3';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'node:path';
import s3Config from '@/common/config/s3.config';
import { UploadController } from '@/upload/upload.controller';
import { UploadService } from '@/upload/upload.service';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 4;
const ALLOWED_MIME = /^image\/(png|jpe?g|gif|webp|heic|heif)$/i;

@Module({
  imports: [
    ConfigModule.forFeature(s3Config),
    MulterModule.registerAsync({
      imports: [ConfigModule.forFeature(s3Config)],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const region = configService.get<string>('s3.region');
        const bucket = configService.get<string>('s3.bucket');

        if (!region || !bucket) {
          throw new Error(
            'S3 설정이 누락되었습니다. AWS_REGION / S3_BUCKET 환경변수를 확인하세요.',
          );
        }

        const s3 = new S3Client({
          region,
        });

        return {
          storage: multerS3({
            s3,
            bucket,
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: (req, file, cb) => {
              const memberId = (req as { user?: { memberId?: number } }).user?.memberId ?? 'anon';
              const ext = extname(file.originalname).toLowerCase();
              cb(null, `feed/${memberId}/${uuidv4()}${ext}`);
            },
          }),
          limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILES },
          fileFilter: (_req, file, cb) => {
            if (!ALLOWED_MIME.test(file.mimetype)) {
              cb(new BadRequestException('이미지 파일만 업로드할 수 있습니다.'), false);
              return;
            }
            cb(null, true);
          },
        };
      },
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}

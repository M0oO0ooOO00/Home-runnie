import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface S3UploadedFile extends Express.Multer.File {
  location?: string;
  key?: string;
}

@Injectable()
export class UploadService {
  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {}

  toUrls(files: S3UploadedFile[]): string[] {
    const publicBaseUrl = this.configService.get<string>('s3.publicBaseUrl') ?? '';

    return files.map((file) => {
      if (publicBaseUrl && file.key) {
        return `${publicBaseUrl.replace(/\/$/, '')}/${file.key}`;
      }
      return file.location ?? '';
    });
  }
}

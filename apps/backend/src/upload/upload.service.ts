import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { extname } from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import { UploadImagesResponseDto } from '@/upload/dto';

interface BufferedUploadedFile extends Express.Multer.File {
  buffer: Buffer;
}

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}

  async uploadImages(
    memberId: number,
    files: Express.Multer.File[],
  ): Promise<UploadImagesResponseDto> {
    const region = this.configService.get<string>('storage.aws.region') ?? '';
    const bucket = this.configService.get<string>('storage.aws.bucket') ?? '';

    if (!region || !bucket) {
      throw new Error(
        'AWS S3 설정이 누락되었습니다. AWS_REGION / AWS_S3_BUCKET 환경변수를 확인하세요.',
      );
    }

    const s3Client = this.createS3Client(region);

    const urls = await Promise.all(
      files.map(async (file) =>
        this.uploadImage(s3Client, bucket, memberId, file as BufferedUploadedFile),
      ),
    );

    return new UploadImagesResponseDto(urls);
  }

  private async uploadImage(
    s3Client: S3Client,
    bucket: string,
    memberId: number,
    file: BufferedUploadedFile,
  ): Promise<string> {
    const key = this.createObjectKey(memberId, file.originalname);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return this.toPublicUrl(bucket, key);
  }

  private createS3Client(region: string): S3Client {
    return new S3Client({ region });
  }

  private createObjectKey(memberId: number, originalName: string): string {
    const ext = extname(originalName).toLowerCase();
    return `feed/${memberId}/${uuidv4()}${ext}`;
  }

  private toPublicUrl(bucket: string, key: string): string {
    const publicBaseUrl = this.configService.get<string>('storage.aws.publicBaseUrl') ?? '';

    if (!publicBaseUrl) {
      const region = this.configService.get<string>('storage.aws.region') ?? '';
      return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
    }

    return `${publicBaseUrl.replace(/\/$/, '')}/${key}`;
  }
}

import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { extname } from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import { UploadImagesResponseDto } from '@/upload/dto';

interface BufferedUploadedFile extends Express.Multer.File {
  buffer: Buffer;
}

const MAX_IMAGE_SIZE = 15 * 1024 * 1024;
const ALLOWED_IMAGE_MIME = /^image\/(png|jpe?g|gif|webp|heic|heif)$/i;

export interface UploadedImageMetadata {
  objectKey: string;
  imageUrl: string;
  mimeType: string;
  fileSize: number;
}

export interface PresignedChatImageUpload extends UploadedImageMetadata {
  uploadUrl: string;
}

export interface ChatImagePresignInput {
  fileName: string;
  mimeType: string;
  fileSize: number;
}

@Injectable()
export class UploadService {
  private s3Client: S3Client | null = null;

  constructor(private readonly configService: ConfigService) {}

  async uploadImages(
    memberId: number,
    files: Express.Multer.File[],
  ): Promise<UploadImagesResponseDto> {
    const images = await this.uploadImagesWithMetadata(memberId, files, 'feed');
    return new UploadImagesResponseDto(images.map((image) => image.imageUrl));
  }

  async uploadImagesWithMetadata(
    memberId: number,
    files: Express.Multer.File[],
    prefix: string,
  ): Promise<UploadedImageMetadata[]> {
    const region = this.configService.get<string>('storage.aws.region') ?? '';
    const bucket = this.configService.get<string>('storage.aws.bucket') ?? '';

    if (!region || !bucket) {
      throw new InternalServerErrorException(
        'AWS S3 설정이 누락되었습니다. AWS_REGION / AWS_S3_BUCKET 환경변수를 확인하세요.',
      );
    }

    const s3Client = this.createS3Client(region);

    return Promise.all(
      files.map(async (file) =>
        this.uploadImage(s3Client, bucket, memberId, prefix, file as BufferedUploadedFile),
      ),
    );
  }

  async createPresignedChatImageUploads(
    memberId: number,
    roomId: number,
    files: ChatImagePresignInput[],
  ): Promise<PresignedChatImageUpload[]> {
    const region = this.configService.get<string>('storage.aws.region') ?? '';
    const bucket = this.configService.get<string>('storage.aws.bucket') ?? '';

    if (!region || !bucket) {
      throw new InternalServerErrorException(
        'AWS S3 설정이 누락되었습니다. AWS_REGION / AWS_S3_BUCKET 환경변수를 확인하세요.',
      );
    }

    const s3Client = this.createS3Client(region);

    return Promise.all(
      files.map(async (file) => {
        if (!ALLOWED_IMAGE_MIME.test(file.mimeType)) {
          throw new BadRequestException(
            'PNG, JPEG, GIF, WebP, HEIC 이미지만 업로드할 수 있습니다.',
          );
        }

        if (file.fileSize < 1 || file.fileSize > MAX_IMAGE_SIZE) {
          throw new BadRequestException('이미지는 파일당 15MB 이하만 업로드할 수 있습니다.');
        }

        const objectKey = this.createObjectKey(memberId, `chat/${roomId}`, file.fileName);
        const uploadUrl = await getSignedUrl(
          // client-s3와 presigner가 서로 다른 Smithy 타입을 해석할 수 있어 SDK 경계에서만 맞춥니다.
          s3Client as unknown as Parameters<typeof getSignedUrl>[0],
          new PutObjectCommand({
            Bucket: bucket,
            Key: objectKey,
            ContentType: file.mimeType,
            ContentLength: file.fileSize,
          }) as unknown as Parameters<typeof getSignedUrl>[1],
          { expiresIn: 300 },
        );

        return {
          uploadUrl,
          objectKey,
          imageUrl: this.toPublicUrl(bucket, objectKey),
          mimeType: file.mimeType,
          fileSize: file.fileSize,
        };
      }),
    );
  }

  isValidChatImageMetadata(
    roomId: number,
    memberId: number,
    image: UploadedImageMetadata,
  ): boolean {
    const expectedPrefix = `chat/${roomId}/${memberId}/`;
    if (!image.objectKey.startsWith(expectedPrefix)) return false;
    if (!ALLOWED_IMAGE_MIME.test(image.mimeType)) return false;
    if (image.fileSize < 1 || image.fileSize > MAX_IMAGE_SIZE) return false;

    const bucket = this.configService.get<string>('storage.aws.bucket') ?? '';
    const region = this.configService.get<string>('storage.aws.region') ?? '';
    if (!bucket || !region) return false;

    return image.imageUrl === this.toPublicUrl(bucket, image.objectKey);
  }

  private async uploadImage(
    s3Client: S3Client,
    bucket: string,
    memberId: number,
    prefix: string,
    file: BufferedUploadedFile,
  ): Promise<UploadedImageMetadata> {
    const key = this.createObjectKey(memberId, prefix, file.originalname);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return {
      objectKey: key,
      imageUrl: this.toPublicUrl(bucket, key),
      mimeType: file.mimetype,
      fileSize: file.size ?? file.buffer.length,
    };
  }

  private createS3Client(region: string): S3Client {
    if (!this.s3Client) {
      this.s3Client = new S3Client({ region });
    }

    return this.s3Client;
  }

  private createObjectKey(memberId: number, prefix: string, originalName: string): string {
    const ext = extname(originalName).toLowerCase();
    const normalizedPrefix = prefix.replace(/^\/+|\/+$/g, '');
    return `${normalizedPrefix}/${memberId}/${uuidv4()}${ext}`;
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

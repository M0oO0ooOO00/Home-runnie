import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
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
    const connectionString = this.configService.get<string>('storage.azure.connectionString') ?? '';
    const containerName = this.configService.get<string>('storage.azure.container') ?? '';

    if (!connectionString || !containerName) {
      throw new Error(
        'Azure Blob Storage 설정이 누락되었습니다. AZURE_STORAGE_CONNECTION_STRING / AZURE_STORAGE_CONTAINER 환경변수를 확인하세요.',
      );
    }

    const containerClient =
      BlobServiceClient.fromConnectionString(connectionString).getContainerClient(containerName);

    const urls = await Promise.all(
      files.map(async (file) =>
        this.uploadImage(containerClient, memberId, file as BufferedUploadedFile),
      ),
    );

    return new UploadImagesResponseDto(urls);
  }

  private async uploadImage(
    containerClient: ContainerClient,
    memberId: number,
    file: BufferedUploadedFile,
  ): Promise<string> {
    const blobName = this.createBlobName(memberId, file.originalname);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: {
        blobContentType: file.mimetype,
      },
    });

    return this.toPublicUrl(blobName, blockBlobClient.url);
  }

  private createBlobName(memberId: number, originalName: string): string {
    const ext = extname(originalName).toLowerCase();
    return `feed/${memberId}/${uuidv4()}${ext}`;
  }

  private toPublicUrl(blobName: string, fallbackUrl: string): string {
    const publicBaseUrl = this.configService.get<string>('storage.azure.publicBaseUrl') ?? '';

    if (!publicBaseUrl) {
      return fallbackUrl;
    }

    return `${publicBaseUrl.replace(/\/$/, '')}/${blobName}`;
  }
}

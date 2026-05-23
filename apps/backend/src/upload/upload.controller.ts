import {
  BadRequestException,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards';
import { CurrentMember } from '@/common';
import { UploadService } from '@/upload/upload.service';

const MAX_FILES = 4;

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('images')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '이미지 업로드 (최대 4장, 5MB/장)' })
  @UseInterceptors(FilesInterceptor('files', MAX_FILES))
  async uploadImages(
    @CurrentMember() memberId: number,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<{ urls: string[] }> {
    if (!files || files.length === 0) {
      throw new BadRequestException('업로드할 이미지가 없습니다.');
    }

    void memberId;
    const urls = this.uploadService.toUrls(files);
    return { urls };
  }
}

import {
  BadRequestException,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '@/auth/guards';
import { CurrentMember } from '@/common';
import { UploadImagesResponseDto } from '@/upload/dto';
import { UploadControllerSwagger, UploadImagesSwagger } from '@/upload/swagger';
import { UploadService } from '@/upload/upload.service';

const MAX_FILES = 4;

@Controller('upload')
@UploadControllerSwagger
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('images')
  @UseGuards(JwtAuthGuard)
  @UploadImagesSwagger
  @UseInterceptors(FilesInterceptor('files', MAX_FILES))
  async uploadImages(
    @CurrentMember() memberId: number,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<UploadImagesResponseDto> {
    if (!files || files.length === 0) {
      throw new BadRequestException('업로드할 이미지가 없습니다.');
    }

    return this.uploadService.uploadImages(memberId, files);
  }
}

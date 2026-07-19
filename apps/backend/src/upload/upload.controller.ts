import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/guards';
import { CurrentMember } from '@/common';
import { CreateImagePresignRequestDto } from '@/upload/dto';
import { UploadControllerSwagger, UploadImagesSwagger } from '@/upload/swagger';
import { PresignedImageUpload, UploadService } from '@/upload/upload.service';

@Controller('upload')
@UploadControllerSwagger
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('images/presign')
  @UseGuards(JwtAuthGuard)
  @UploadImagesSwagger
  async createPresignedImageUploads(
    @CurrentMember() memberId: number,
    @Body() request: CreateImagePresignRequestDto,
  ): Promise<{ files: PresignedImageUpload[] }> {
    const files = await this.uploadService.createPresignedImageUploads(
      memberId,
      request.files,
      'feed',
    );

    return { files };
  }
}

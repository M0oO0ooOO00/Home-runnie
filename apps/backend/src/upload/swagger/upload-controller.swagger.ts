import { applyDecorators } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export const UploadControllerSwagger = applyDecorators(ApiTags('업로드'));

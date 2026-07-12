import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '@/common';
import { UploadImagesResponseDto } from '@/upload/dto';

export const UploadImagesSwagger = applyDecorators(
  ApiBearerAuth(),
  ApiConsumes('multipart/form-data'),
  ApiOperation({
    summary: '이미지 업로드',
    description:
      '피드 작성/수정에 사용할 이미지 파일을 AWS S3에 업로드합니다. 최대 4장, 파일당 15MB까지 허용합니다.',
  }),
  ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: '업로드할 이미지 파일 목록',
        },
      },
      required: ['files'],
    },
  }),
  ApiCreatedResponse({
    type: UploadImagesResponseDto,
    description: '업로드된 이미지 URL 목록',
  }),
  ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: '파일 없음, 이미지 외 확장자, 용량/개수 제한 초과',
  }),
  ApiUnauthorizedResponse({
    type: ErrorResponseDto,
    description: '인증되지 않은 사용자',
  }),
  ApiInternalServerErrorResponse({
    type: ErrorResponseDto,
    description: '서버 내부 오류 또는 AWS S3 업로드 실패',
  }),
);

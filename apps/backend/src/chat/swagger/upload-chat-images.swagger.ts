import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '@/common';

export const UploadChatImagesSwagger = applyDecorators(
  ApiBearerAuth(),
  ApiConsumes('multipart/form-data'),
  ApiOperation({
    summary: '채팅 이미지 업로드',
    description:
      '채팅방에 전송할 이미지를 AWS S3에 업로드합니다. 최대 4장, 파일당 15MB까지 허용하며 이미지 파일만 업로드할 수 있습니다.',
  }),
  ApiParam({
    name: 'roomId',
    type: Number,
    description: '채팅방 ID',
    example: 1,
  }),
  ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          maxItems: 4,
          items: {
            type: 'string',
            format: 'binary',
          },
          description: '업로드할 이미지 파일 목록 (파일당 최대 15MB)',
        },
      },
      required: ['files'],
    },
  }),
  ApiCreatedResponse({
    description: '채팅 이미지 업로드 성공',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              objectKey: { type: 'string', example: 'chat/1/10/uuid.png' },
              imageUrl: {
                type: 'string',
                format: 'uri',
                example: 'https://bucket.s3.ap-northeast-2.amazonaws.com/chat/1/10/uuid.png',
              },
              mimeType: { type: 'string', example: 'image/png' },
              fileSize: { type: 'integer', example: 102400 },
            },
          },
        },
      },
    },
  }),
  ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: '파일 없음, 이미지 외 파일, 파일당 15MB 초과 또는 이미지 4장 초과',
  }),
  ApiUnauthorizedResponse({
    type: ErrorResponseDto,
    description: '인증되지 않은 사용자',
  }),
  ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: '채팅방을 찾을 수 없거나 채팅방 멤버가 아닌 사용자',
  }),
  ApiInternalServerErrorResponse({
    type: ErrorResponseDto,
    description: '서버 내부 오류 또는 AWS S3 업로드 실패',
  }),
);

import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ChatRoomResponseDto } from '@/chat/dto/response';
import { ErrorResponseDto } from '@/common';

export const CreateChatRoomSwagger = applyDecorators(
  ApiOperation({
    summary: '채팅방 생성',
    description:
      '특정 모집 게시글에 대한 채팅방을 생성합니다. 생성한 사용자는 자동으로 방장(HOST) 역할을 부여받습니다.',
  }),
  ApiBearerAuth(),
  ApiOkResponse({
    type: ChatRoomResponseDto,
    description: '채팅방 생성 성공',
    example: {
      id: 1,
      postId: 123,
      createdAt: '2024-01-17T12:00:00.000Z',
      updatedAt: '2024-01-17T12:00:00.000Z',
    },
  }),
  ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: '잘못된 요청 (게시글 ID가 없거나 유효하지 않은 경우)',
    example: {
      code: 400,
      data: {
        errorCode: 'BAD_REQUEST',
        message: '게시글 ID는 필수입니다.',
        path: '/chat/rooms',
        timestamp: '2025-01-18T00:00:00.000Z',
      },
    },
  }),
  ApiUnauthorizedResponse({
    type: ErrorResponseDto,
    description: '인증되지 않은 사용자',
    example: {
      code: 401,
      data: {
        errorCode: 'UNAUTHORIZED',
        message: '로그인이 필요합니다.',
        path: '/chat/rooms',
        timestamp: '2025-01-18T00:00:00.000Z',
      },
    },
  }),
  ApiInternalServerErrorResponse({
    type: ErrorResponseDto,
    description: '서버 오류',
    example: {
      code: 500,
      data: {
        errorCode: 'UNKNOWN_ERROR',
        message: '알 수 없는 오류가 발생했습니다.',
        path: '/chat/rooms',
        timestamp: '2025-01-18T00:00:00.000Z',
      },
    },
  }),
);

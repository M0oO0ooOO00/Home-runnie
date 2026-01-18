import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GetChatRoomsResponseDto } from '@/chat/dto/response';
import { ErrorResponseDto } from '@/common';

export const GetChatRoomsSwagger = applyDecorators(
  ApiOperation({
    summary: '내 채팅방 목록 조회',
    description:
      '로그인한 사용자가 참여 중인 채팅방 목록을 페이지네이션과 함께 조회합니다. 최신 업데이트 순으로 정렬됩니다.',
  }),
  ApiBearerAuth(),
  ApiOkResponse({
    type: GetChatRoomsResponseDto,
    description: '채팅방 목록 조회 성공',
    example: {
      data: [
        {
          id: 1,
          postId: 123,
          createdAt: '2024-01-17T12:00:00.000Z',
          updatedAt: '2024-01-17T12:00:00.000Z',
        },
        {
          id: 2,
          postId: 456,
          createdAt: '2024-01-16T10:00:00.000Z',
          updatedAt: '2024-01-16T15:30:00.000Z',
        },
      ],
      total: 2,
      page: 1,
      limit: 20,
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

import { ApiProperty } from '@nestjs/swagger';
import { ChatRoomResponse } from '@homerunnie/shared';
import { ChatRoom } from '@/chat/domain';

export class ChatRoomResponseDto implements ChatRoomResponse {
  @ApiProperty({
    description: '채팅방 ID',
    type: 'number',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '게시글 ID',
    type: 'number',
    example: 123,
  })
  postId: number;

  @ApiProperty({
    description: '생성 일시',
    type: 'string',
    example: '2024-01-17T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정 일시',
    type: 'string',
    example: '2024-01-17T12:00:00Z',
  })
  updatedAt: Date;

  constructor(partial: Partial<ChatRoomResponseDto>) {
    Object.assign(this, partial);
  }

  static from(data: typeof ChatRoom.$inferSelect): ChatRoomResponseDto {
    return new ChatRoomResponseDto({
      id: data.id,
      postId: data.postId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}

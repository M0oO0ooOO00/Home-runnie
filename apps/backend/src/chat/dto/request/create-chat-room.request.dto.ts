import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { CreateChatRoomRequest } from '@homerunnie/shared';

export class CreateChatRoomRequestDto implements CreateChatRoomRequest {
  @ApiProperty({
    description: '모집 게시글 ID',
    type: 'number',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  postId: number;
}

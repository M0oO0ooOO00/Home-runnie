import { ApiProperty } from '@nestjs/swagger';
import { ChatRoomMemberResponse, ChatRoomMemberRole } from '@homerunnie/shared';

export class ChatRoomMemberResponseDto implements ChatRoomMemberResponse {
  @ApiProperty({ description: '멤버 ID', example: 1 })
  memberId: number;

  @ApiProperty({ description: '닉네임', example: '수비니' })
  nickname: string;

  @ApiProperty({
    description: '역할',
    enum: ChatRoomMemberRole,
    example: ChatRoomMemberRole.HOST,
  })
  role: ChatRoomMemberRole;

  constructor(partial: Partial<ChatRoomMemberResponseDto>) {
    Object.assign(this, partial);
  }

  static from(data: {
    memberId: number;
    nickname: string;
    role: string;
  }): ChatRoomMemberResponseDto {
    return new ChatRoomMemberResponseDto({
      memberId: data.memberId,
      nickname: data.nickname,
      role: data.role as ChatRoomMemberRole,
    });
  }
}

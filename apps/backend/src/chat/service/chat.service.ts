import { Inject, Injectable } from '@nestjs/common';
import { ChatRepository } from '@/chat/repository';
import { ChatRoomResponseDto, GetChatRoomsResponseDto } from '@/chat/dto/response';
import { ChatRoomMemberRole } from '@homerunnie/shared';

@Injectable()
export class ChatService {
  constructor(@Inject() private readonly chatRepository: ChatRepository) {}

  async createChatRoom(postId: number, memberId: number): Promise<ChatRoomResponseDto> {
    const chatRoom = await this.chatRepository.createChatRoom(postId);
    await this.chatRepository.createChatRoomMember(chatRoom.id, memberId, ChatRoomMemberRole.HOST);

    return ChatRoomResponseDto.from(chatRoom);
  }

  async getMyChatRooms(
    memberId: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<GetChatRoomsResponseDto> {
    const [chatRooms, total] = await Promise.all([
      this.chatRepository.findChatRoomsByMemberId(memberId, page, limit),
      this.chatRepository.countChatRoomsByMemberId(memberId),
    ]);
    return GetChatRoomsResponseDto.from(chatRooms, total, page, limit);
  }
}

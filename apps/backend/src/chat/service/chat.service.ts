import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { ChatRepository } from '@/chat/repository';
import { ChatRoomResponseDto, GetChatRoomsResponseDto } from '@/chat/dto/response';
import { ChatRoomMemberRole } from '@homerunnie/shared';
import { DATABASE_CONNECTION } from '@/common';
import * as schema from '@/common/db/schema';

type DbType = NodePgDatabase<typeof schema>;

@Injectable()
export class ChatService {
  constructor(
    @Inject() private readonly chatRepository: ChatRepository,
    @Inject(DATABASE_CONNECTION) private readonly db: DbType,
  ) {}

  async createChatRoom(postId: number, memberId: number): Promise<ChatRoomResponseDto> {
    const chatRoom = await this.db.transaction(async (tx) => {
      const newChatRoom = await this.chatRepository.createChatRoom(postId, tx);

      await this.chatRepository.createChatRoomMember(
        newChatRoom.id,
        memberId,
        ChatRoomMemberRole.HOST,
        tx,
      );

      return newChatRoom;
    });

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

import { Inject, Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, and, desc, count } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '@/common';
import { ChatRoom, ChatRoomMember, ChatMessage } from '@/chat/domain';
import { ChatRoomMemberRole } from '@homerunnie/shared';

type ChatRoomType = typeof ChatRoom.$inferSelect;
type ChatRoomMemberType = typeof ChatRoomMember.$inferSelect;

@Injectable()
export class ChatRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  /**
   * 채팅방 생성
   */
  async createChatRoom(postId: number): Promise<ChatRoomType> {
    const [chatRoom] = await this.db.insert(ChatRoom).values({ postId }).returning();

    return chatRoom;
  }

  /**
   * 채팅방 멤버 추가
   */
  async createChatRoomMember(
    chatRoomId: number,
    memberId: number,
    role: ChatRoomMemberRole,
  ): Promise<ChatRoomMemberType> {
    const [member] = await this.db
      .insert(ChatRoomMember)
      .values({ chatRoomId, memberId, role })
      .returning();

    return member;
  }

  /**
   * 특정 멤버가 참여한 채팅방 목록 조회 (페이지네이션)
   */
  async findChatRoomsByMemberId(
    memberId: number,
    page: number,
    limit: number,
  ): Promise<ChatRoomType[]> {
    const offset = (page - 1) * limit;

    const chatRooms = await this.db
      .select({
        id: ChatRoom.id,
        postId: ChatRoom.postId,
        createdAt: ChatRoom.createdAt,
        updatedAt: ChatRoom.updatedAt,
        deleted: ChatRoom.deleted,
      })
      .from(ChatRoom)
      .innerJoin(ChatRoomMember, eq(ChatRoom.id, ChatRoomMember.chatRoomId))
      .where(and(eq(ChatRoomMember.memberId, memberId), eq(ChatRoom.deleted, false)))
      .orderBy(desc(ChatRoom.updatedAt))
      .limit(limit)
      .offset(offset);

    return chatRooms;
  }

  /**
   * 특정 멤버가 참여한 채팅방 총 개수
   */
  async countChatRoomsByMemberId(memberId: number): Promise<number> {
    const result = await this.db
      .select({ count: count() })
      .from(ChatRoom)
      .innerJoin(ChatRoomMember, eq(ChatRoom.id, ChatRoomMember.chatRoomId))
      .where(and(eq(ChatRoomMember.memberId, memberId), eq(ChatRoom.deleted, false)));

    return result[0]?.count || 0;
  }

  /**
   * 채팅방 ID로 조회
   */
  async findChatRoomById(chatRoomId: number): Promise<ChatRoomType | null> {
    const [chatRoom] = await this.db
      .select()
      .from(ChatRoom)
      .where(and(eq(ChatRoom.id, chatRoomId), eq(ChatRoom.deleted, false)));

    return chatRoom || null;
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { ChatRepository } from '@/chat/repository';
import { ChatRoomResponseDto, GetChatRoomsResponseDto } from '@/chat/dto/response';
import { ChatRoomMemberRole } from '@homerunnie/shared';

@Injectable()
export class ChatService {
  constructor(@Inject() private readonly chatRepository: ChatRepository) {}

  /**
   * 채팅방 생성
   * @param postId - 모집 게시글 ID
   * @param memberId - 채팅방을 생성하는 사용자 ID
   * @returns 생성된 채팅방 정보
   */
  async createChatRoom(postId: number, memberId: number): Promise<ChatRoomResponseDto> {
    // TODO(human): 채팅방 생성 로직 구현
    // 1. chatRepository.createChatRoom(postId)로 채팅방 생성
    // 2. chatRepository.createChatRoomMember(chatRoomId, memberId, ChatRoomMemberRole.HOST)로 방장 등록
    // 3. ChatRoomResponseDto.from(chatRoom) 반환

    throw new Error('TODO(human): createChatRoom 메서드 구현 필요');
  }

  /**
   * 내가 참여한 채팅방 목록 조회
   * @param memberId - 사용자 ID
   * @param page - 페이지 번호 (기본값: 1)
   * @param limit - 페이지당 항목 수 (기본값: 20)
   * @returns 채팅방 목록 (페이지네이션 포함)
   */
  async getMyChatRooms(
    memberId: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<GetChatRoomsResponseDto> {
    // TODO(human): 내 채팅방 목록 조회 로직 구현
    // 1. chatRepository.findChatRoomsByMemberId(memberId, page, limit)로 채팅방 목록 조회
    // 2. chatRepository.countChatRoomsByMemberId(memberId)로 전체 개수 조회
    // 3. GetChatRoomsResponseDto.from(chatRooms, total, page, limit) 반환

    throw new Error('TODO(human): getMyChatRooms 메서드 구현 필요');
  }
}

import { CreateChatRoomRequest, ChatRoomResponse, GetChatRoomsResponse } from '@homerunnie/shared';

import { apiClient } from '@/lib/fetchClient';

/**
 * 채팅방 생성
 * @param postId 모집 게시글 ID
 * @returns 생성된 채팅방 정보
 */
export const createChatRoom = async (postId: number): Promise<ChatRoomResponse> => {
  const request: CreateChatRoomRequest = { postId };
  return apiClient.post<ChatRoomResponse>('/chat/rooms', request, { authRequired: true });
};

/**
 * 내 채팅방 목록 조회
 * @param page 페이지 번호 (기본값: 1)
 * @param limit 페이지당 항목 수 (기본값: 20)
 * @returns 채팅방 목록 및 페이지네이션 정보
 */
export const getMyChatRooms = async (
  page: number = 1,
  limit: number = 20,
): Promise<GetChatRoomsResponse> => {
  return apiClient.get<GetChatRoomsResponse>(`/chat/rooms?page=${page}&limit=${limit}`, {
    authRequired: true,
  });
};

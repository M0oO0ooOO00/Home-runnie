import {
  CreateChatRoomRequest,
  ChatRoomResponse,
  GetChatRoomsResponse,
  ChatRoomMemberResponse,
  JoinRequestResponse,
} from '@homerunnie/shared';

import { apiClient } from '@/lib/fetchClient';

/**
 * 채팅방 생성
 */
export const createChatRoom = async (postId: number): Promise<ChatRoomResponse> => {
  const request: CreateChatRoomRequest = { postId };
  return apiClient.post<ChatRoomResponse>('/chat/rooms', request, { authRequired: true });
};

/**
 * 내 채팅방 목록 조회
 */
export const getMyChatRooms = async (
  page: number = 1,
  limit: number = 20,
): Promise<GetChatRoomsResponse> => {
  return apiClient.get<GetChatRoomsResponse>(`/chat/rooms?page=${page}&limit=${limit}`, {
    authRequired: true,
  });
};

/**
 * 채팅방 멤버 목록 조회
 */
export const getChatRoomMembers = async (roomId: number): Promise<ChatRoomMemberResponse[]> => {
  return apiClient.get<ChatRoomMemberResponse[]>(`/chat/rooms/${roomId}/members`, {
    authRequired: true,
  });
};

/**
 * 채팅방 참여 요청
 */
export const requestJoinChatRoom = async (roomId: number): Promise<void> => {
  return apiClient.post(`/chat/rooms/${roomId}/join-requests`, {}, { authRequired: true });
};

/**
 * 대기 중인 참여 요청 목록 조회 (방장 전용)
 */
export const getPendingJoinRequests = async (roomId: number): Promise<JoinRequestResponse[]> => {
  return apiClient.get<JoinRequestResponse[]>(`/chat/rooms/${roomId}/join-requests`, {
    authRequired: true,
  });
};

/**
 * 참여 요청 수락 (방장 전용)
 */
export const acceptJoinRequest = async (requestId: number): Promise<void> => {
  return apiClient.patch(`/chat/join-requests/${requestId}/accept`, {}, { authRequired: true });
};

/**
 * 참여 요청 거절 (방장 전용)
 */
export const rejectJoinRequest = async (requestId: number): Promise<void> => {
  return apiClient.patch(`/chat/join-requests/${requestId}/reject`, {}, { authRequired: true });
};

/**
 * 멤버 강퇴 (방장 전용)
 */
export const kickMember = async (roomId: number, memberId: number): Promise<void> => {
  return apiClient.delete(`/chat/rooms/${roomId}/members/${memberId}`, {
    authRequired: true,
  });
};

/**
 * 채팅방 삭제 (방장 전용)
 */
export const deleteChatRoom = async (roomId: number): Promise<void> => {
  return apiClient.delete(`/chat/rooms/${roomId}`, { authRequired: true });
};

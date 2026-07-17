import {
  CreateChatRoomRequest,
  ChatRoomResponse,
  GetChatRoomsResponse,
  ChatRoomMemberResponse,
  JoinRequestResponse,
} from '@homerunnie/shared';

import { apiClient } from '@/lib/fetchClient';
import type { ChatImageUploadMetadata } from '@/types/chat';

export const CHAT_IMAGE_MAX_FILES = 4;
export const CHAT_IMAGE_MAX_SIZE_MB = 15;
export const CHAT_IMAGE_MAX_SIZE_BYTES = CHAT_IMAGE_MAX_SIZE_MB * 1024 * 1024;

const ALLOWED_CHAT_IMAGE_MIME = /^image\/(png|jpe?g|gif|webp|heic|heif)$/i;
const ALLOWED_CHAT_IMAGE_EXTENSION = /.(png|jpe?g|gif|webp|heic|heif)$/i;

export interface UploadChatImagesResponse {
  files: ChatImageUploadMetadata[];
}

export function validateChatImageFiles(files: File[]): void {
  if (files.length > CHAT_IMAGE_MAX_FILES) {
    throw new Error(`채팅 이미지는 최대 ${CHAT_IMAGE_MAX_FILES}장까지 선택할 수 있어요.`);
  }

  const invalidFile = files.find((file) => {
    const mimeType = file.type.trim();
    const hasValidMimeType = ALLOWED_CHAT_IMAGE_MIME.test(mimeType);
    const hasValidExtension = ALLOWED_CHAT_IMAGE_EXTENSION.test(file.name);

    // HEIC/HEIF MIME 타입을 전달하지 않는 브라우저에서는 확장자를 폴백으로 사용합니다.
    return mimeType ? !hasValidMimeType : !hasValidExtension;
  });
  if (invalidFile) {
    throw new Error('PNG, JPEG, GIF, WebP, HEIC 이미지만 업로드할 수 있어요.');
  }

  const oversizedFile = files.find((file) => file.size > CHAT_IMAGE_MAX_SIZE_BYTES);
  if (oversizedFile) {
    throw new Error(`이미지는 파일당 ${CHAT_IMAGE_MAX_SIZE_MB}MB 이하만 업로드할 수 있어요.`);
  }
}

export async function uploadChatImages(
  roomId: number,
  files: File[],
): Promise<UploadChatImagesResponse> {
  validateChatImageFiles(files);

  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  return apiClient.postFormData<UploadChatImagesResponse>(
    `/chat/rooms/${roomId}/images`,
    formData,
    {
      authRequired: true,
    },
  );
}

/**
 * 채팅방 생성
 */
export const createChatRoom = async (postId: number): Promise<ChatRoomResponse> => {
  const request: CreateChatRoomRequest = { postId };
  return apiClient.post<ChatRoomResponse>('/chat/rooms', request, { authRequired: true });
};

/**
 * 게시글 ID로 채팅방 조회
 */
export const getChatRoomByPostId = async (
  postId: number,
): Promise<{ chatRoomId: number | null }> => {
  return apiClient.get<{ chatRoomId: number | null }>(`/chat/rooms/by-post/${postId}`, {
    authRequired: true,
  });
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

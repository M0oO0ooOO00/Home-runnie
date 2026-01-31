import { http, HttpResponse } from 'msw';
import { CreateChatRoomRequest, ChatRoomResponse, GetChatRoomsResponse } from '@homerunnie/shared';

// 목업 데이터 저장소 (메모리)
const mockChatRooms: ChatRoomResponse[] = [
  {
    id: 1,
    postId: 1,
    createdAt: new Date('2025-01-15T10:00:00Z'),
    updatedAt: new Date('2025-01-17T14:30:00Z'),
  },
  {
    id: 2,
    postId: 2,
    createdAt: new Date('2025-01-16T09:00:00Z'),
    updatedAt: new Date('2025-01-18T16:20:00Z'),
  },
  {
    id: 3,
    postId: 3,
    createdAt: new Date('2025-01-17T11:00:00Z'),
    updatedAt: new Date('2025-01-18T18:45:00Z'),
  },
];

// 채팅방 생성 API 목업 핸들러
export const createChatRoomHandler = http.post<
  Record<string, never>,
  CreateChatRoomRequest,
  ChatRoomResponse
>('/chat/rooms', async ({ request }) => {
  const body = await request.json();
  const { postId } = body;

  // 이미 존재하는 채팅방인지 확인
  const existingRoom = mockChatRooms.find((room) => room.postId === postId);
  if (existingRoom) {
    return HttpResponse.json(existingRoom, { status: 200 });
  }

  // 새 채팅방 생성
  const newRoom: ChatRoomResponse = {
    id: mockChatRooms.length + 1,
    postId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  mockChatRooms.push(newRoom);

  return HttpResponse.json(newRoom, { status: 201 });
});

// 채팅방 목록 조회 API 목업 핸들러
export const getChatRoomsHandler = http.get<
  Record<string, never>,
  Record<string, never>,
  GetChatRoomsResponse
>('/chat/rooms', ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '20', 10);

  // 최신순으로 정렬 (updatedAt 기준 내림차순)
  const sortedRooms = [...mockChatRooms].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  // 페이지네이션 처리
  const offset = (page - 1) * limit;
  const paginatedRooms = sortedRooms.slice(offset, offset + limit);

  const response: GetChatRoomsResponse = {
    data: paginatedRooms,
    total: mockChatRooms.length,
    page,
    limit,
  };

  return HttpResponse.json(response, { status: 200 });
});

// 모든 핸들러를 배열로 export
export const handlers = [createChatRoomHandler, getChatRoomsHandler];

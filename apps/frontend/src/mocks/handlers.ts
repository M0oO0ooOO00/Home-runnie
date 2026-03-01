/*
 * 채팅방 생성/조회 mock 핸들러는 실제 백엔드 API 연동으로 전환되어
 * 현재는 주석 처리합니다.
 *
 * 필요 시 아래 핸들러를 다시 활성화해서 로컬 mock 테스트에 사용할 수 있습니다.
 */

// // 목업 데이터 저장소 (메모리)
// const mockChatRooms: ChatRoomResponse[] = [
//   {
//     id: 1,
//     postId: 1,
//     createdAt: new Date('2025-01-15T10:00:00Z'),
//     updatedAt: new Date('2025-01-17T14:30:00Z'),
//   },
// ];
//
// export const createChatRoomHandler = http.post<
//   Record<string, never>,
//   CreateChatRoomRequest,
//   ChatRoomResponse
// >('/chat/rooms', async ({ request }) => {
//   const body = await request.json();
//   const { postId } = body;
//
//   const existingRoom = mockChatRooms.find((room) => room.postId === postId);
//   if (existingRoom) {
//     return HttpResponse.json(existingRoom, { status: 200 });
//   }
//
//   const newRoom: ChatRoomResponse = {
//     id: mockChatRooms.length + 1,
//     postId,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   };
//
//   mockChatRooms.push(newRoom);
//   return HttpResponse.json(newRoom, { status: 201 });
// });
//
// export const getChatRoomsHandler = http.get<
//   Record<string, never>,
//   Record<string, never>,
//   GetChatRoomsResponse
// >('/chat/rooms', ({ request }) => {
//   const url = new URL(request.url);
//   const page = parseInt(url.searchParams.get('page') || '1', 10);
//   const limit = parseInt(url.searchParams.get('limit') || '20', 10);
//
//   const sortedRooms = [...mockChatRooms].sort(
//     (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
//   );
//
//   const offset = (page - 1) * limit;
//   const paginatedRooms = sortedRooms.slice(offset, offset + limit);
//
//   const response: GetChatRoomsResponse = {
//     data: paginatedRooms,
//     total: mockChatRooms.length,
//     page,
//     limit,
//   };
//
//   return HttpResponse.json(response, { status: 200 });
// });

export const handlers = [];

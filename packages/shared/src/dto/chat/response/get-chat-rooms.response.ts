import { ChatRoomResponse } from './chat-room.response';

export interface GetChatRoomsResponse {
  data: ChatRoomResponse[];
  total: number;
  page: number;
  limit: number;
}

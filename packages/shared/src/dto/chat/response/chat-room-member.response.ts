import { ChatRoomMemberRole } from '../../../entities/chat/chat-room-member-role';

export interface ChatRoomMemberResponse {
  memberId: number;
  nickname: string;
  role: ChatRoomMemberRole;
}

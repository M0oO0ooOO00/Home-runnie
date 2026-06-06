export interface ChatHistoryMessagePayload {
  id: number;
  message: string;
  isOwn: boolean;
  nickname: string;
  supportTeam: string | null;
  createdAt?: string;
}

export interface ChatReceivedMessagePayload {
  nickname: string;
  message: string;
  isOwn: boolean;
  supportTeam?: string | null;
  roomId?: string;
  createdAt?: string;
}

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'me' | 'other' | 'system';
  nickname: string;
  supportTeam: string | null;
  createdAt: string;
}

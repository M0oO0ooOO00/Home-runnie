'use client';

import { useChatMessages } from '@/hooks/chat/useChatMessages';
import { useChatRoomEvents } from '@/hooks/chat/useChatRoomEvents';

export type { ChatMessage } from '@/types/chat';

export function useSocket(roomId: string) {
  const { messages, sendMessage, connected } = useChatMessages(roomId);
  const { joinRequestCount, resetJoinRequestCount, kickedFromRoom, roomDeleted } =
    useChatRoomEvents(roomId);

  return {
    messages,
    sendMessage,
    connected,
    joinRequestCount,
    resetJoinRequestCount,
    kickedFromRoom,
    roomDeleted,
  };
}

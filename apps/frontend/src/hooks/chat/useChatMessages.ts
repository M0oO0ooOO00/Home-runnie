'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  mapHistoryMessageToChatMessage,
  mapReceivedMessageToChatMessage,
} from '@/hooks/chat/chatMessage.mapper';
import type {
  ChatHistoryMessagePayload,
  ChatMessage,
  ChatReceivedMessagePayload,
} from '@/types/chat';
import { useChatSocket } from '@/hooks/chat/ChatSocketProvider';

export function useChatMessages(roomId: string) {
  const { socket, connected } = useChatSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!socket || !connected) return;

    socket.emit('join_room', { roomId });

    const handleHistory = (history: ChatHistoryMessagePayload[]) => {
      setMessages(history.map(mapHistoryMessageToChatMessage));
    };

    const handleMessage = (data: ChatReceivedMessagePayload) => {
      if (data.roomId && data.roomId !== roomId) return;

      setMessages((prev) => [...prev, mapReceivedMessageToChatMessage(data)]);
    };

    socket.on('message_history', handleHistory);
    socket.on('received_message', handleMessage);

    return () => {
      socket.off('message_history', handleHistory);
      socket.off('received_message', handleMessage);
    };
  }, [socket, connected, roomId]);

  const sendMessage = useCallback(
    (text: string) => {
      socket?.emit('message', { roomId, message: text });
    },
    [socket, roomId],
  );

  return {
    messages,
    sendMessage,
    connected,
  };
}

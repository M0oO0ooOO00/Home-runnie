'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChatMessageType } from '@homerunnie/shared';
import {
  mapHistoryMessageToChatMessage,
  mapReceivedMessageToChatMessage,
} from '@/hooks/chat/chatMessage.mapper';
import type {
  ChatHistoryMessagePayload,
  ChatMessage,
  ChatReceivedMessagePayload,
} from '@/types/chat';
import { uploadChatImages } from '@/apis/chat/chat';
import { useChatSocket } from '@/hooks/chat/ChatSocketProvider';

export function useChatMessages(roomId: string) {
  const { socket, connected } = useChatSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    setMessages([]);

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
    async (text: string, imageFiles: File[] = []) => {
      const trimmedText = text.trim();

      if (!socket || !connected) {
        throw new Error('채팅 서버에 연결되지 않았습니다. 잠시 후 다시 시도해주세요.');
      }

      if (!trimmedText && imageFiles.length === 0) return;

      if (imageFiles.length > 0) {
        const { files } = await uploadChatImages(Number(roomId), imageFiles);

        socket.emit('message', {
          roomId,
          message: trimmedText || undefined,
          type: ChatMessageType.IMAGE,
          attachments: files.map((file, imageOrder) => ({
            ...file,
            imageOrder,
          })),
        });
        return;
      }

      socket.emit('message', { roomId, message: trimmedText });
    },
    [socket, connected, roomId],
  );

  return {
    messages,
    sendMessage,
    connected,
  };
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'me' | 'other';
  nickname: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001';

export function useSocket(roomId: string) {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io(`${BACKEND_URL}/chat`, {
      withCredentials: true, // 쿠키(accessToken) 자동 전송
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('join_room', { roomId });
    });

    socket.on('received_message', (data: { nickname: string; message: string; isOwn: boolean }) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: data.message,
          sender: data.isOwn ? 'me' : 'other',
          nickname: data.nickname,
        },
      ]);
    });

    socket.on('user_joined', (data: { nickname: string; message: string }) => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: data.message, sender: 'other', nickname: '' },
      ]);
    });

    socket.on('user_left', (data: { nickname: string; message: string }) => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: data.message, sender: 'other', nickname: '' },
      ]);
    });

    socket.on('disconnect', () => setConnected(false));

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const sendMessage = (text: string) => {
    socketRef.current?.emit('message', { roomId, message: text });
  };

  return { messages, sendMessage, connected };
}

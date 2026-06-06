'use client';

import { useCallback, useEffect, useState } from 'react';
import { useChatSocket } from '@/hooks/chat/ChatSocketProvider';

export function useChatRoomEvents(roomId: string) {
  const { socket, connected } = useChatSocket();
  const [joinRequestCount, setJoinRequestCount] = useState(0);
  const [kickedFromRoom, setKickedFromRoom] = useState(false);
  const [roomDeleted, setRoomDeleted] = useState(false);

  useEffect(() => {
    if (!socket || !connected) return;

    const handleJoinRequest = () => setJoinRequestCount((prev) => prev + 1);
    const handleKicked = () => setKickedFromRoom(true);
    const handleDeleted = () => setRoomDeleted(true);

    socket.on('join_request_received', handleJoinRequest);
    socket.on('member_kicked', handleKicked);
    socket.on('room_deleted', handleDeleted);

    return () => {
      socket.off('join_request_received', handleJoinRequest);
      socket.off('member_kicked', handleKicked);
      socket.off('room_deleted', handleDeleted);
    };
  }, [socket, connected, roomId]);

  const resetJoinRequestCount = useCallback(() => {
    setJoinRequestCount(0);
  }, []);

  return {
    joinRequestCount,
    resetJoinRequestCount,
    kickedFromRoom,
    roomDeleted,
  };
}

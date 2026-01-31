'use client';

import React, { useState, useEffect } from 'react';
import ChatList from './components/ChatList';
import { getMyChatRooms, createChatRoom } from '@/apis/chat/chat';
import { ChatRoomResponse } from '@homerunnie/shared';
import { ChatRoomsContext } from '@/stores/ChatRoomsContext';

interface ChatListItem {
  id: string;
  title: string;
  participants: string[];
  lastMessage: string;
  unreadCount: number;
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [dummyRooms, setDummyRooms] = useState<ChatListItem[]>([]);

  // API로 가져온 채팅방 정보를 저장 (ChatBox에서 사용)
  const [chatRoomsMap, setChatRoomsMap] = useState<Map<string, ChatRoomResponse>>(new Map());

  // 초기 로드 시 채팅방 목록 조회
  useEffect(() => {
    const loadChatRooms = async () => {
      setLoading(true);
      try {
        const response = await getMyChatRooms(1, 20);

        // 채팅방 정보를 Map에 저장 (ChatBox에서 사용)
        const roomsMap = new Map<string, ChatRoomResponse>();
        response.data.forEach((room) => {
          roomsMap.set(String(room.id), room);
        });
        setChatRoomsMap(roomsMap);

        // API 응답 데이터를 더미 데이터 형식으로 변환하여 업데이트
        const updatedRooms: ChatListItem[] = response.data.map((room, index) => ({
          id: String(room.id),
          title: `게시글 ${room.postId} 채팅방`,
          participants: [`참여자${index + 1}`, `참여자${index + 2}`],
          lastMessage: '새로운 메시지가 없습니다.',
          unreadCount: 0,
        }));

        setDummyRooms(updatedRooms);
      } catch (error) {
        console.error('채팅방 목록 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChatRooms();
  }, []);

  const testCreateChatRoom = async () => {
    setLoading(true);
    try {
      const newRoom = await createChatRoom(999);
      console.log('채팅방 생성 완료:', newRoom);

      // 채팅방 정보를 Map에 저장 (ChatBox에서 사용)
      setChatRoomsMap((prev) => {
        const newMap = new Map(prev);
        newMap.set(String(newRoom.id), newRoom);
        return newMap;
      });

      // 새로 생성된 채팅방을 더미 데이터에 추가
      const newChatRoom: ChatListItem = {
        id: String(newRoom.id),
        title: `게시글 ${newRoom.postId} 채팅방`,
        participants: ['나', '상대방'],
        lastMessage: '채팅방이 생성되었습니다.',
        unreadCount: 0,
      };

      setDummyRooms((prev) => [newChatRoom, ...prev]);
    } catch (error) {
      console.error('에러:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-row justify-center h-[calc(100vh-84px)]">
      <aside className="flex flex-col min-w-[400px] border-r border-gray-200 bg-white h-full">
        <div className="shrink-0">
          <h1 className="text-t00 pb-[30px] p-6">채팅</h1>
          <div className="px-6 pb-4 flex flex-col gap-2">
            <button
              onClick={testCreateChatRoom}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 text-sm w-full"
            >
              채팅방 생성
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatRoomsContext.Provider value={chatRoomsMap}>
            <ChatList chatRooms={dummyRooms} activeChatId="" />
          </ChatRoomsContext.Provider>
        </div>
      </aside>
      <main className="flex flex-col w-full bg-gray-100 h-full">{children}</main>
    </div>
  );
}

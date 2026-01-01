'use client';

import React from 'react';
import ChatList from './components/ChatList';

interface ChatListItem {
  id: string;
  title: string;
  participants: string[];
  lastMessage: string;
  unreadCount: number;
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const dummyRooms: ChatListItem[] = [
    {
      id: '1',
      title: '한화 vs 두산 직관 모임',
      participants: ['김이글', '박곰돌', '최수리'],
      lastMessage: '오늘 경기장 앞에서 5시에 봐요!',
      unreadCount: 3,
    },
    {
      id: '2',
      title: '개발자 스터디',
      participants: ['홍길동', '김철수'],
      lastMessage: 'PR 올렸습니다. 확인 부탁드려요.',
      unreadCount: 0,
    },
  ];

  return (
    <div className="flex flex-row justify-center min-h-[calc(100vh-84px)]">
      <aside className="flex flex-col min-w-[400px] border-r border-gray-200 bg-white">
        <h1 className="text-t00 pb-[30px] p-6">채팅</h1>
        <ChatList chatRooms={dummyRooms} activeChatId="" />
      </aside>
      <main className="flex flex-col w-full bg-gray-100">{children}</main>
    </div>
  );
}

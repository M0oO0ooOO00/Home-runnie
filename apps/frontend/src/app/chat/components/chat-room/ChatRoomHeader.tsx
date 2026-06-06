'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Menu } from 'lucide-react';

interface ChatRoomHeaderProps {
  title: string;
  matchDate: string;
  matchTeam: string;
  sidebar: {
    isOpen: boolean;
    onToggle: () => void;
  };
  actions?: ReactNode;
}

const ChatRoomHeader = ({ title, matchDate, matchTeam, sidebar, actions }: ChatRoomHeaderProps) => {
  const router = useRouter();

  return (
    <div className="bg-white shadow-sm px-5 py-4 w-full">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 lg:gap-6 min-w-0 flex-1">
          <button
            type="button"
            onClick={() => router.push('/chat')}
            className="lg:hidden p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer shrink-0"
            aria-label="목록으로"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-t03-sb lg:text-t01-sb text-gray-900 truncate">{title}</h1>
          <div className="hidden lg:flex items-center gap-6 shrink-0">
            <div className="flex items-center gap-2 text-c01-r justify-center">
              <span className="text-gray-600">경기날짜</span>
              <span className="text-gray-800">{matchDate}</span>
            </div>
            <div className="flex items-center gap-2 text-c01-r">
              <span className="text-gray-600">경기팀</span>
              <span className="text-gray-800">{matchTeam}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {actions}
          <button
            type="button"
            onClick={sidebar.onToggle}
            className={`p-1 rounded transition-colors cursor-pointer ${
              sidebar.isOpen ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-100'
            }`}
            aria-label="사이드바"
            aria-expanded={sidebar.isOpen}
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomHeader;

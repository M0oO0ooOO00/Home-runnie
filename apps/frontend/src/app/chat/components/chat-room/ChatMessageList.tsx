'use client';

import { Fragment, useEffect, useRef } from 'react';
import type { ChatMessage } from '@/types/chat';
import { formatKoreanFullDate, isSameDay } from '@/lib/format';
import MessageBubble from './MessageBubble';

interface ChatMessageListProps {
  messages: ChatMessage[];
  connected: boolean;
  contentClassName?: string;
  onProfileClick: (info: { nickname: string; supportTeam: string | null }) => void;
}

const ChatMessageList = ({
  messages,
  connected,
  contentClassName,
  onProfileClick,
}: ChatMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="grow overflow-y-auto min-h-0">
      <div className={`flex flex-col justify-end gap-4 min-h-full ${contentClassName ?? ''}`}>
        {!connected && <p className="text-center text-sm text-gray-400">서버에 연결 중...</p>}
        {messages.map((msg, idx) => {
          const currentDate = msg.createdAt ? new Date(msg.createdAt) : null;
          const isCurrentValid = !!currentDate && !isNaN(currentDate.getTime());
          const prev = messages[idx - 1];
          const prevDate = prev?.createdAt ? new Date(prev.createdAt) : null;
          const isPrevValid = !!prevDate && !isNaN(prevDate.getTime());
          const showDateDivider =
            isCurrentValid && (!isPrevValid || !isSameDay(prevDate!, currentDate!));

          return (
            <Fragment key={msg.id}>
              {showDateDivider && (
                <div className="flex justify-center my-2">
                  <span className="text-xs text-gray-500 bg-gray-200 rounded-full px-3 py-1">
                    {formatKoreanFullDate(currentDate!)}
                  </span>
                </div>
              )}
              <MessageBubble msg={msg} onProfileClick={onProfileClick} />
            </Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessageList;

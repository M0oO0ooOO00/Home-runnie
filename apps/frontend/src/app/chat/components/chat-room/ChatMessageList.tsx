'use client';

import { useEffect, useRef } from 'react';
import type { ChatMessage } from '@/types/chat';
import { formatKoreanFullDate } from '@/lib/format';
import { getMessageDateDividerDate, parseMessageDate } from '@/shared/utils/message-date';
import MessageBubble from '@/app/chat/components/chat-room/MessageBubble';

type MessageListRenderItem =
  | { type: 'date-divider'; id: string; date: Date }
  | { type: 'message'; id: string; message: ChatMessage };

interface ChatMessageListProps {
  messages: ChatMessage[];
  connected: boolean;
  contentClassName?: string;
  onProfileClick: (info: { nickname: string; supportTeam: string | null }) => void;
}

const toMessageListRenderItems = (messages: ChatMessage[]): MessageListRenderItem[] => {
  const items: MessageListRenderItem[] = [];

  messages.forEach((message, index) => {
    const currentDate = parseMessageDate(message.createdAt);
    const previousDate = parseMessageDate(messages[index - 1]?.createdAt);
    const dividerDate = getMessageDateDividerDate(currentDate, previousDate);

    if (dividerDate) {
      items.push({
        type: 'date-divider',
        id: `date-divider-${message.id}`,
        date: dividerDate,
      });
    }

    items.push({
      type: 'message',
      id: `message-${message.id}`,
      message,
    });
  });

  return items;
};

const DateDivider = ({ date }: { date: Date }) => (
  <div className="flex justify-center my-2">
    <span className="text-xs text-gray-500 bg-gray-200 rounded-full px-3 py-1">
      {formatKoreanFullDate(date)}
    </span>
  </div>
);

const ChatMessageList = ({
  messages,
  connected,
  contentClassName,
  onProfileClick,
}: ChatMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageListItems = toMessageListRenderItems(messages);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="grow overflow-y-auto min-h-0">
      <div className={`flex flex-col justify-end gap-4 min-h-full ${contentClassName ?? ''}`}>
        {!connected && <p className="text-center text-sm text-gray-400">서버에 연결 중...</p>}
        {messageListItems.map((item) => {
          switch (item.type) {
            case 'date-divider':
              return <DateDivider key={item.id} date={item.date} />;
            case 'message':
              return (
                <MessageBubble key={item.id} msg={item.message} onProfileClick={onProfileClick} />
              );
          }
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessageList;

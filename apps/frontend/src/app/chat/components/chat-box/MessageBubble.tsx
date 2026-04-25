import Image from 'next/image';
import { Team, TEAM_ASSETS, DEFAULT_PROFILE_IMAGE } from '@homerunnie/shared';
import { ChatMessage } from '@/hooks/chat/useSocket';
import { formatKoreanTime } from '@/lib/format';

const MessageBubble = ({ msg }: { msg: ChatMessage }) => {
  if (msg.sender === 'system') {
    return (
      <div className="flex justify-center">
        <p className="text-xs text-gray-400 bg-gray-200 rounded-full px-3 py-1">{msg.text}</p>
      </div>
    );
  }

  const isMe = msg.sender === 'me';
  const showProfile = !isMe && msg.nickname;
  const date = msg.createdAt ? new Date(msg.createdAt) : null;
  const time = date && !isNaN(date.getTime()) ? formatKoreanTime(date) : '';

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div>
        {showProfile && <p className="text-sm text-gray-500 mb-1">{msg.nickname}</p>}
        <div className="flex items-end gap-2">
          {showProfile && (
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
              <Image
                src={
                  (msg.supportTeam && TEAM_ASSETS[msg.supportTeam as Team]?.image) ||
                  DEFAULT_PROFILE_IMAGE
                }
                alt={msg.nickname}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {isMe && time && <span className="text-xs text-gray-400 shrink-0">{time}</span>}
          <div
            className={[
              'rounded-2xl px-4 py-2 max-w-xs lg:max-w-md',
              isMe
                ? 'bg-green-500 text-white rounded-br-none'
                : 'bg-white text-black rounded-bl-none',
            ].join(' ')}
          >
            {msg.text}
          </div>
          {!isMe && time && <span className="text-xs text-gray-400 shrink-0">{time}</span>}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;

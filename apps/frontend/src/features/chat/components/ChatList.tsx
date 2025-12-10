"use client";

import { useRouter } from "next/navigation";

interface ChatListItem {
  id: string;
  title: string;
  participants: string[];
  lastMessage: string;
  unreadCount: number;
}

interface ChatListProps {
  chatRooms: ChatListItem[];
  activeChatId: string;
}

const ChatList = ({ chatRooms, activeChatId }: ChatListProps) => {
  const router = useRouter();

  const handleChatRoomClick = (id: string) => {
    router.push(`/chat/${id}`);
  };

  return (
    <div className="flex flex-col w-full h-full bg-white overflow-y-auto">
      {chatRooms.map((room) => (
        <div
          key={room.id}
          onClick={() => handleChatRoomClick(room.id)}
          className={`p-4 cursor-pointer border-b border-gray-100 ${
            room.id === activeChatId ? "bg-gray-100" : "hover:bg-gray-50"
          }`}
        >
          <div className="flex justify-between items-start">
            <h2 className="font-bold text-lg mb-1">{room.title}</h2>
            {room.unreadCount > 0 && (
              <span className="bg-green-500 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
                {room.unreadCount}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate mb-1">{room.participants.join(", ")}</p>
          <p className="text-sm text-gray-700 truncate">{room.lastMessage}</p>
        </div>
      ))}
    </div>
  );
};

export default ChatList;

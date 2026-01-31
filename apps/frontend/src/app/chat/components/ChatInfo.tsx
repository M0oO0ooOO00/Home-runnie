'use client';

interface ChatInfoProps {
  title: string;
  participants: string;
  matchDate: string;
  matchTeam: string;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const ChatInfo = ({
  title,
  participants,
  matchDate,
  matchTeam,
  onToggleSidebar,
  isSidebarOpen,
}: ChatInfoProps) => {
  return (
    <div className="bg-white shadow-sm px-[20px] py-[16px] w-full">
      <div className="flex items-center justify-between">
        <div className="justify-center items-center flex gap-[24px]">
          <h1 className="text-t01-sb text-gray-900">{title}</h1>
          <div className="flex items-center gap-6">
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
        <button
          type="button"
          onClick={onToggleSidebar}
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
            isSidebarOpen ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300'
          }`}
          aria-label="정보"
        >
          <span className="text-xs text-gray-600 font-semibold">i</span>
        </button>
      </div>
    </div>
  );
};

export default ChatInfo;

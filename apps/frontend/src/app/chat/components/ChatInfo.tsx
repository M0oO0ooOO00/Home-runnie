interface ChatInfoProps {
  title: string;
  participants: string;
  matchDate: string;
  matchTeam: string;
}

const ChatInfo = ({ title, participants, matchDate, matchTeam }: ChatInfoProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm gap-[30px] p-[30px]">
      <div className="flex items-center gap-4 mb-3">
        <h1 className="text-2xl font-bold">{title}</h1>
        <span className="text-b01-r text-gray-400">참여자</span>
        <p className="text-b01-r text-gray-600 truncate">{participants}</p>
      </div>
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-b01-r text-gray-400">경기날짜</span>
          <span className="text-b01-r text-gray-800">{matchDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-b01-r text-gray-400">경기팀</span>
          <span className="text-b01-r text-gray-800">{matchTeam}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInfo;

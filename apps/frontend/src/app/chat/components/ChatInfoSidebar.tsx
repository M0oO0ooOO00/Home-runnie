'use client';

import { User } from 'lucide-react';

interface ChatInfoSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onReport: () => void;
  title: string;
  participants: string;
  matchDate: string;
  matchTeam: string;
}

// 참여자 데이터 타입
interface Participant {
  id: string;
  name: string;
  isMe?: boolean;
}

// 임시 참여자 데이터 (나중에 API로 교체)
const mockParticipants: Participant[] = [
  { id: '2', name: '수비니' },
  { id: '3', name: '수미니' },
  { id: '4', name: '누누' },
  { id: '5', name: '호호' },
  { id: '6', name: '용용' },
  { id: '7', name: '실버' },
  { id: '8', name: '바보' },
];

const ChatInfoSidebar = ({
  isOpen,
  onClose,
  onReport,
  title,
  participants,
  matchDate,
  matchTeam,
}: ChatInfoSidebarProps) => {
  const handleLeaveRoom = () => {
    // TODO: 채팅방 나가기 로직 구현
    console.log('채팅방 나가기');
  };

  return (
    <div
      className={`h-full bg-white border-l border-gray-200 shadow-lg shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? 'w-96' : 'w-0 border-0'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center px-[20px] py-[16px] border-b border-gray-200">
          <h2 className="text-t01-sb">상세정보</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div>
            <div className="text-b02-r flex flex-col py-[30px] px-5 gap-[16px]">
              <div className="flex items-center gap-2">
                <h3 className="text-gray-500 w-20">경기날짜</h3>
                <p className="text-gray-900">{matchDate}</p>
              </div>

              <div className="flex items-center gap-2">
                <h3 className="text-gray-500 w-20">경기팀</h3>
                <p className="text-gray-900">{matchTeam}</p>
              </div>
            </div>

            <div className="py-[30px] px-5 border-[1px]">
              <div className="flex items-center justify-between mb-[22px]">
                <h3 className="text-t04-sb text-gray-900">참여자</h3>
                <span className="text-b03-r text-gray-700">{mockParticipants.length}명</span>
              </div>
              <div className="mb-[36px]">
                <p className="text-b03-r text-gray-600 mb-[8px]">내 프로필</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-pink-200 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-b02-r text-gray-600">{'윤창현'}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {mockParticipants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-[20px]">
                    <div className="w-9 h-9 rounded-full bg-pink-200 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-pink-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-b02-r text-gray-900">{participant.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className=" border-gray-200 py-[15px] px-[20px]">
          <button
            onClick={onReport}
            className="w-full text-right text-b02-r text-gray-900 hover:text-gray-800 transition-colors mb-[8px]"
          >
            신고하기
          </button>
          <button
            onClick={handleLeaveRoom}
            className="w-full text-right text-b02-r text-red-500 hover:text-gray-800 transition-colors"
          >
            채팅방 나가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInfoSidebar;

import ChatInfo from './ChatInfo';
import ChatInput from './ChatInput';
import ChatReport from './ChatReport';

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
}

interface RoomInfo {
  title: string;
  participants: string;
  matchDate: string;
  matchTeam: string;
}

interface RoomData {
  info: RoomInfo;
  messages: Message[];
}

const ChatBox = ({ roomId }: { roomId: string }) => {
  // (테스트용) 방 번호에 따라 다른 데이터를 보여주기 위한 더미 데이터 객체
  const DUMMY_DB: Record<string, RoomData> = {
    '1': {
      info: {
        title: '한화 vs 두산 직관 모임',
        participants: '김이글, 박곰돌, 최수리 03명',
        matchDate: '2025/03/02',
        matchTeam: '한화이글스 VS 두산베어스',
      },
      messages: [
        { id: 1, text: '오늘 경기장 앞에서 5시에 봐요!', sender: 'other' },
        { id: 2, text: '네 알겠습니다~', sender: 'me' },
      ],
    },
    '2': {
      info: {
        title: '개발자 스터디',
        participants: '홍길동, 김철수 02명',
        matchDate: '2025/03/05',
        matchTeam: '스터디 모임',
      },
      messages: [
        { id: 1, text: 'PR 올렸습니다.', sender: 'other' },
        { id: 2, text: '확인해볼게요!', sender: 'me' },
      ],
    },
  };
  const currentRoomData = DUMMY_DB[roomId] || {
    info: {
      title: '알 수 없는 방',
      participants: '-',
      matchDate: '-',
      matchTeam: '-',
    },
    messages: [],
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-100 p-6">
      <section className="flex flex-col h-full px-[120px] py-[24px]">
        <ChatReport />

        <ChatInfo
          title={currentRoomData.info.title}
          participants={currentRoomData.info.participants}
          matchDate={currentRoomData.info.matchDate}
          matchTeam={currentRoomData.info.matchTeam}
        />

        <div className="flex-grow flex flex-col justify-end gap-4 overflow-y-auto">
          {currentRoomData.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={[
                  'rounded-2xl px-4 py-2 max-w-xs lg:max-w-md',
                  msg.sender === 'me'
                    ? 'bg-green-500 text-white rounded-br-none'
                    : 'bg-white text-black rounded-bl-none',
                ].join(' ')}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <ChatInput />
      </section>
    </div>
  );
};

export default ChatBox;

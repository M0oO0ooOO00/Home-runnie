import ChatBox from '../components/ChatBox';
import ChatList from '../components/ChatList';

interface ChatRoomPageProps {
  params: {
    id: string;
  };
}

const sampleChatRooms = [
  {
    id: '1',
    title: '서울우유 공지방',
    participants: ['수비니', '수미니', '누누', '호호', '용용', '실버', '창창'],
    lastMessage: '우리 지금 도착했음',
    unreadCount: 3,
  },
  {
    id: '2',
    title: 'Moo',
    participants: ['수비니', '수미니', '누누', '호호', '용용', '실버', '창창'],
    lastMessage: '다들 어디세요 이거 글자 넘어가면 그냥 점점으로 사라지게..',
    unreadCount: 0,
  },
  {
    id: '3',
    title: '서울우유 공지방',
    participants: ['수비니', '수미니', '누누', '호호', '용용', '실버', '창창'],
    lastMessage: '우리 지금 도착했음',
    unreadCount: 3,
  },
];

export default function ChatRoomPage({ params }: ChatRoomPageProps) {
  return (
    <div className="flex flex-row justify-center min-h-[calc(100vh-84px)]">
      <section className="flex flex-col min-w-[400px] border-r border-gray-200">
        <ChatList chatRooms={sampleChatRooms} activeChatId={params.id} />
      </section>
      <section className="flex flex-col w-full ">
        <ChatBox />
      </section>
    </div>
  );
}

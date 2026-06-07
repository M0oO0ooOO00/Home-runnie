import ChatRoomView from '@/app/chat/components/chat-room/ChatRoomView';

interface ChatRoomPageProps {
  params: {
    id: string;
  };
}

export default function ChatRoomPage({ params }: ChatRoomPageProps) {
  return (
    <section className="flex flex-col w-full h-full">
      <ChatRoomView roomId={params.id} />
    </section>
  );
}

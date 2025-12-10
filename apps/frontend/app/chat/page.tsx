import ChatCard from "@/features/chat/components/ChatCard";
import ChatTable from "@/features/chat/components/ChatTable";
import Image from "next/image";

export default function ChatPage() {
  const chatListData = [
    { id: 1, game: "한화 vs 두산", title: "직관 갈 사람 제발제발", date: "7/28" },
    { id: 2, game: "한화 vs 두산", title: "직관 갈 사람 제발제발", date: "7/28" },
    { id: 3, game: "한화 vs 두산", title: "직관 갈 사람 제발제발", date: "7/28" },
    { id: 4, game: "한화 vs 두산", title: "직관 갈 사람 제발제발", date: "7/28" },
    { id: 5, game: "한화 vs 두산", title: "직관 갈 사람 제발제발", date: "7/28" },
  ];

  return (
    <div className="flex h-screen flex-col bg-gray-100 px-[120px] justify-center">
      <main className="flex flex-col gap-[24px] justify-center">
        <section className="flex flex-row gap-[24px] justify-center">
          <ChatCard
            title="새로운 직관메이트"
            subtitle="모집글 작성하기"
            description="직관메이트를 모집해보세요"
            graphic={<Image src="/icons/posting_book.svg" alt="글쓰기" width={120} height={120} />}
          />
          <ChatCard
            title="참여중인 직관"
            subtitle="채팅방 바로가기"
            description="직관메이트와 대화해보세요"
            graphic={<Image src="/icons/posting_note.svg" alt="글쓰기" width={120} height={120} />}
          />
        </section>
        <section className="flex flex-col gap-[16px]">
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-[20px] font-bold">나의 직관메이트를 찾아보세요!</h1>
            <p className="text-[14px] text-gray-500 cursor-pointer">전체보기</p>
          </div>
          <ChatTable data={chatListData} />
        </section>
      </main>
    </div>
  );
}

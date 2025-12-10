"use client";

import { useRouter } from "next/navigation";

interface ChatData {
  id: number | string;
  game: string;
  title: string;
  date: string;
}

interface ChatTableProps {
  data: ChatData[];
}

const ChatTable = ({ data }: ChatTableProps) => {
  const router = useRouter();

  const handleRowClick = (id: number | string) => {
    router.push(`/chat/${id}`);
  };

  return (
    <div className="w-full bg-white rounded-[18px] p-[24px]">
      <div className="grid grid-cols-[1fr_3fr_1fr] text-left text-gray-400 text-[14px] border-b border-gray-100 pb-[12px]">
        <h3>경기</h3>
        <h3>제목</h3>
        <h3 className="text-right">경기 날짜</h3>
      </div>
      <div className="flex flex-col gap-[12px] mt-[12px]">
        {data.map((item) => (
          <div
            key={item.id}
            onClick={() => handleRowClick(item.id)}
            className="grid grid-cols-[1fr_3fr_1fr] text-left text-[16px] py-[12px] cursor-pointer hover:bg-gray-50 rounded-md"
          >
            <span>{item.game}</span>
            <span>{item.title}</span>
            <span className="text-right">{item.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatTable;

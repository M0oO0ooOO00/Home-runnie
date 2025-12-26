'use client';

import Image from 'next/image';
import { useState } from 'react';
import ReportModal from '@/shared/ui/modal/ReportModal';

const ChatReport = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 임시 참여자 데이터
  const participants = ['가나다', '이승현', '김민우', '박준'];

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-b01-r text-gray-500 flex items-center gap-1"
        >
          <Image src="/icons/report.svg" alt="신고하기" width={28} height={28} />
          신고하기
        </button>
      </div>
      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        participants={participants}
      />
    </>
  );
};
export default ChatReport;

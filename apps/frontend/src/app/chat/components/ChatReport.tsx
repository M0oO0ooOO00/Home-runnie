'use client';

import ReportModal from '@/shared/ui/modal/ReportModal';

interface ChatReportProps {
  isModalOpen: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
}

const ChatReport = ({ isModalOpen, onOpenModal, onCloseModal }: ChatReportProps) => {
  const participants = ['가나다', '이승현', '김민우', '박준'];

  return <ReportModal isOpen={isModalOpen} onClose={onCloseModal} participants={participants} />;
};
export default ChatReport;

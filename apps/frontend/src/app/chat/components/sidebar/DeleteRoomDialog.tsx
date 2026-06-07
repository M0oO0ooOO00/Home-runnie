'use client';

import ChatConfirmDialog from '@/app/chat/components/sidebar/ChatConfirmDialog';

interface DeleteRoomDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteRoomDialog = ({ open, onConfirm, onCancel }: DeleteRoomDialogProps) => {
  return (
    <ChatConfirmDialog
      open={open}
      title="채팅방을 삭제하시겠어요?"
      description="삭제하면 모든 대화 내용이 사라지고 되돌릴 수 없어요"
      confirmText="삭제하기"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};

export default DeleteRoomDialog;

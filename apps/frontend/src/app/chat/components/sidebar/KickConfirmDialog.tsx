'use client';

import { ChatRoomMemberResponse } from '@homerunnie/shared';
import ChatConfirmDialog from './ChatConfirmDialog';

interface KickConfirmDialogProps {
  targets: ChatRoomMemberResponse[];
  onConfirm: () => void;
  onCancel: () => void;
}

const KickConfirmDialog = ({ targets, onConfirm, onCancel }: KickConfirmDialogProps) => {
  const targetNames = targets.map((target) => target.nickname).join(', ');
  const firstTarget = targets[0];
  const description =
    targets.length === 1 && firstTarget
      ? `내보내면 ${firstTarget.nickname}님은 더 이상 이 채팅방을 이용할 수 없어요`
      : `내보내면 ${targets.length}명은 더 이상 이 채팅방을 이용할 수 없어요`;

  return (
    <ChatConfirmDialog
      open={targets.length > 0}
      title={`${targetNames} 님을 내보내시겠어요?`}
      description={description}
      confirmText="내보내기"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};

export default KickConfirmDialog;

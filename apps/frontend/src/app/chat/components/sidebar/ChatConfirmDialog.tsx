'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/ui/primitives/dialog';

interface ChatConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ChatConfirmDialog = ({
  open,
  title,
  description,
  confirmText,
  onConfirm,
  onCancel,
}: ChatConfirmDialogProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onCancel();
        }
      }}
    >
      <DialogContent showCloseButton={false} className="sm:max-w-[480px] p-10">
        <DialogHeader className="items-center">
          <DialogTitle className="text-xl font-bold text-center">{title}</DialogTitle>
          <DialogDescription className="text-center text-gray-500 mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 py-4 rounded-lg border border-gray-200 text-gray-900 text-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-4 rounded-lg bg-gray-900 text-white text-lg font-medium hover:bg-gray-800 transition-colors cursor-pointer"
          >
            {confirmText}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatConfirmDialog;

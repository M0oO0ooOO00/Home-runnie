'use client';

import { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommentInputProps {
  placeholder?: string;
  isSubmitting?: boolean;
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  autoFocus?: boolean;
  initialValue?: string;
  submitLabel?: string;
  submittingLabel?: string;
}

const MAX_LENGTH = 1000;

export function CommentInput({
  placeholder = '댓글을 입력하세요',
  isSubmitting = false,
  onSubmit,
  onCancel,
  autoFocus = false,
  initialValue = '',
  submitLabel = '등록',
  submittingLabel = '등록 중',
}: CommentInputProps) {
  const [value, setValue] = useState(initialValue);
  const canSubmit =
    value.trim().length > 0 &&
    value.length <= MAX_LENGTH &&
    !isSubmitting &&
    value.trim() !== initialValue.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(value.trim());
    setValue(initialValue);
  };

  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        maxLength={MAX_LENGTH + 100}
        className="w-full min-h-[60px] resize-none outline-none text-b03-r text-gray-800 placeholder:text-gray-500 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 focus:bg-white focus:border-gray-400 focus:ring-1 focus:ring-gray-300 transition-colors"
      />
      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-c01-m text-gray-500 hover:text-gray-700 px-3 py-1.5 transition-colors"
          >
            취소
          </button>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={cn(
            'inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-c01-m transition-colors',
            canSubmit
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed',
          )}
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
          <span>{isSubmitting ? submittingLabel : submitLabel}</span>
        </button>
      </div>
    </div>
  );
}

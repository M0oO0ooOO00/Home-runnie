'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { Team } from '@homerunnie/shared';
import { cn } from '@/lib/utils';
import { TeamProfileAvatar } from '@/shared/ui/profile/team-profile-avatar';

interface CommentInputProps {
  placeholder?: string;
  isSubmitting?: boolean;
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  autoFocus?: boolean;
  initialValue?: string;
  submitLabel?: string;
  submittingLabel?: string;
  supportTeam?: Team | string | null;
  variant?: 'compact' | 'composer';
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
  supportTeam,
  variant = 'compact',
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

  if (variant === 'composer') {
    return (
      <div className="flex flex-col gap-[10px]">
        <div className="flex min-h-[86px] items-center gap-4 rounded-2xl bg-gray-100 px-5 py-4 transition-colors focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-300">
          <TeamProfileAvatar supportTeam={supportTeam} className="size-12 shrink-0" />
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            maxLength={MAX_LENGTH + 100}
            className="min-h-[48px] flex-1 resize-none bg-transparent text-b02-r text-gray-800 outline-none placeholder:text-gray-400"
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full px-5 py-3 text-b03-m text-gray-500 transition-colors hover:text-gray-700"
            >
              취소
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={cn(
              'inline-flex h-[37px] min-w-[89px] items-center justify-center rounded-lg px-5 text-b02-sb transition-colors',
              canSubmit
                ? 'bg-gray-950 text-white hover:bg-gray-850'
                : 'cursor-not-allowed bg-gray-300 text-gray-500',
            )}
          >
            {isSubmitting && <Loader2 className="mr-2 animate-spin" size={16} />}
            <span>{isSubmitting ? submittingLabel : submitLabel}</span>
          </button>
        </div>
      </div>
    );
  }

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
          {isSubmitting && <Loader2 className="animate-spin" size={14} />}
          <span>{isSubmitting ? submittingLabel : submitLabel}</span>
        </button>
      </div>
    </div>
  );
}

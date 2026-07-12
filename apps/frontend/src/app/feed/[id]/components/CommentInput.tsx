'use client';

import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import type { Team } from '@homerunnie/shared';
import { cn } from '@/lib/utils';
import { validateUploadImageFiles } from '@/apis/upload/upload';
import { TeamProfileAvatar } from '@/shared/ui/profile/team-profile-avatar';
import { showToast, ToastIconType } from '@/shared/ui/toast/toast';
import type { CommentSubmitValue } from './comment.types';

interface CommentInputProps {
  placeholder?: string;
  isSubmitting?: boolean;
  onSubmit: (value: CommentSubmitValue) => void;
  onCancel?: () => void;
  autoFocus?: boolean;
  initialValue?: string;
  initialImageUrl?: string | null;
  submitLabel?: string;
  submittingLabel?: string;
  supportTeam?: Team | string | null;
  variant?: 'compact' | 'composer';
  allowImage?: boolean;
}

const MAX_LENGTH = 1000;

export function CommentInput({
  placeholder = '댓글을 입력하세요',
  isSubmitting = false,
  onSubmit,
  onCancel,
  autoFocus = false,
  initialValue = '',
  initialImageUrl = null,
  submitLabel = '등록',
  submittingLabel = '등록 중',
  supportTeam,
  variant = 'compact',
  allowImage = false,
}: CommentInputProps) {
  const [value, setValue] = useState(initialValue);
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(initialImageUrl);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewSrc = previewUrl ?? existingImageUrl;
  const hasImage = Boolean(imageFile || existingImageUrl);
  const canSubmit =
    (value.trim().length > 0 || hasImage) &&
    value.length <= MAX_LENGTH &&
    !isSubmitting &&
    (value.trim() !== initialValue.trim() ||
      Boolean(imageFile) ||
      existingImageUrl !== initialImageUrl);

  useEffect(() => {
    const currentPreviewUrl = previewUrl;

    return () => {
      if (currentPreviewUrl) URL.revokeObjectURL(currentPreviewUrl);
    };
  }, [previewUrl]);

  const handleImageChange = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    try {
      validateUploadImageFiles([file]);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : '업로드할 수 없는 이미지예요.',
        ToastIconType.INFO,
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setImageFile(file);
    setExistingImageUrl(null);
    setPreviewUrl(URL.createObjectURL(file));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setImageFile(undefined);
    setExistingImageUrl(null);
    setPreviewUrl(undefined);
  };

  const resetInput = () => {
    setValue(initialValue);
    setImageFile(undefined);
    setPreviewUrl(undefined);
    setExistingImageUrl(initialImageUrl);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      content: value.trim(),
      imageFile,
      imageUrl: imageFile ? undefined : existingImageUrl,
    });
    resetInput();
  };

  const imagePicker = allowImage ? (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleImageChange(e.target.files)}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isSubmitting || hasImage}
        className={cn(
          'inline-flex size-9 items-center justify-center rounded-full transition-colors',
          hasImage
            ? 'cursor-not-allowed bg-gray-200 text-gray-400'
            : 'bg-white/80 text-gray-500 ring-1 ring-gray-200 hover:bg-white hover:text-gray-900',
        )}
        aria-label="댓글 이미지 첨부"
      >
        <ImagePlus size={18} strokeWidth={1.8} />
      </button>
    </>
  ) : null;

  const imagePreview = previewSrc ? (
    <div className="relative mt-3 h-28 w-28 overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-200">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={previewSrc} alt="첨부 이미지 미리보기" className="h-full w-full object-cover" />
      <button
        type="button"
        onClick={handleRemoveImage}
        className="absolute right-1.5 top-1.5 inline-flex size-7 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/75"
        aria-label="첨부 이미지 삭제"
      >
        <X size={16} strokeWidth={2.2} />
      </button>
    </div>
  ) : null;

  if (variant === 'composer') {
    return (
      <div className="flex flex-col gap-[10px]">
        <div className="relative flex min-h-[86px] items-center gap-4 rounded-2xl bg-gray-100 px-5 py-4 pr-16 transition-colors focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-300">
          <TeamProfileAvatar supportTeam={supportTeam} className="size-12 shrink-0" />
          <div className="flex min-w-0 flex-1 flex-col">
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              autoFocus={autoFocus}
              maxLength={MAX_LENGTH + 100}
              className="min-h-[48px] resize-none bg-transparent text-b02-r text-gray-800 outline-none placeholder:text-gray-400"
            />
            {imagePreview}
          </div>
          <div className="absolute bottom-4 right-4">{imagePicker}</div>
        </div>
        <div className="flex items-center justify-end gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={() => {
                resetInput();
                onCancel();
              }}
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
      <div className="relative rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 pr-12 transition-colors focus-within:border-gray-400 focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-300">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          maxLength={MAX_LENGTH + 100}
          className="min-h-[60px] w-full resize-none bg-transparent text-b03-r text-gray-800 outline-none placeholder:text-gray-500"
        />
        {imagePreview}
        <div className="absolute bottom-2 right-2">{imagePicker}</div>
      </div>
      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={() => {
              resetInput();
              onCancel();
            }}
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

'use client';

import { ChangeEvent, useRef } from 'react';
import { ArrowLeft, ImagePlus, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FEED_POST_MAX_CONTENT, FEED_POST_MAX_IMAGES } from '@/app/feed/constants';
import { showToast, ToastIconType } from '@/shared/ui/toast/toast';

export interface FeedPostFormImage {
  key: string;
  src: string;
}

export interface FeedPostFormValue {
  content: string;
  images: FeedPostFormImage[];
}

export interface FeedPostFormActions {
  onContentChange: (content: string) => void;
  onFilesSelected: (files: File[]) => void;
  onRemoveImage: (index: number) => void;
  onBack: () => void;
  onSubmit: () => void;
}

interface FeedPostFormProps {
  value: FeedPostFormValue;
  submitLabel: string;
  submitDisabled: boolean;
  isSubmitting: boolean;
  errorMessage?: string | null;
  actions: FeedPostFormActions;
}

export function FeedPostForm({
  value,
  submitLabel,
  submitDisabled,
  isSubmitting,
  errorMessage,
  actions,
}: FeedPostFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { content, images } = value;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    const remaining = FEED_POST_MAX_IMAGES - images.length;

    if (selectedFiles.length > remaining) {
      showToast(
        `이미지는 최대 ${FEED_POST_MAX_IMAGES}장까지 선택할 수 있어요.`,
        ToastIconType.INFO,
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    actions.onFilesSelected(selectedFiles);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-[600px] mx-auto py-4">
      <div className="flex items-center justify-between mb-3 px-1">
        <button
          type="button"
          onClick={actions.onBack}
          className="inline-flex items-center gap-1 text-c01-m text-gray-700 hover:text-gray-900 transition-colors"
          aria-label="뒤로가기"
        >
          <ArrowLeft size={18} />
          <span>뒤로</span>
        </button>
        <button
          type="button"
          onClick={actions.onSubmit}
          disabled={submitDisabled}
          className={cn(
            'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-c01-m transition-colors',
            submitDisabled
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:bg-primary/90',
          )}
        >
          {isSubmitting && <Loader2 className="animate-spin" size={14} />}
          <span>{submitLabel}</span>
        </button>
      </div>

      <div className="bg-background rounded-2xl border border-gray-100 p-4">
        <textarea
          value={content}
          onChange={(event) => actions.onContentChange(event.target.value)}
          placeholder="무엇을 공유하고 싶나요?"
          maxLength={FEED_POST_MAX_CONTENT + 100}
          className="w-full min-h-[200px] resize-none outline-none text-b03-r text-gray-800 placeholder:text-gray-400"
        />

        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-1 mt-3">
            {images.map((image, index) => (
              <div key={image.key} className="relative aspect-square overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.src} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => actions.onRemoveImage(index)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                  aria-label="이미지 삭제"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={images.length >= FEED_POST_MAX_IMAGES}
            className={cn(
              'inline-flex items-center gap-1.5 text-c01-m transition-colors',
              images.length >= FEED_POST_MAX_IMAGES
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-700 hover:text-gray-900',
            )}
          >
            <ImagePlus size={18} />
            <span>
              사진 {images.length}/{FEED_POST_MAX_IMAGES}
            </span>
          </button>
          <span
            className={cn(
              'text-c01-r',
              content.length > FEED_POST_MAX_CONTENT ? 'text-red-500' : 'text-gray-400',
            )}
          >
            {content.length}/{FEED_POST_MAX_CONTENT}
          </span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {errorMessage && <p className="text-c01-r text-red-500 mt-3 px-1">{errorMessage}</p>}
    </div>
  );
}

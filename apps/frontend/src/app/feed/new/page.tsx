'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ImagePlus, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCreateFeedPostMutation } from '@/hooks/feed/useCreateFeedPostMutation';

const MAX_IMAGES = 4;
const MAX_CONTENT = 2000;

interface ImageItem {
  previewUrl: string;
  fakeUploadedUrl: string;
}

export default function FeedNewPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<ImageItem[]>([]);

  const { mutate, isPending, isError, error } = useCreateFeedPostMutation({
    onSuccess: () => router.push('/feed'),
  });

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, [images]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const remaining = MAX_IMAGES - images.length;
    const accepted = files.slice(0, remaining);

    const newItems: ImageItem[] = accepted.map((file, i) => ({
      previewUrl: URL.createObjectURL(file),
      fakeUploadedUrl: `https://picsum.photos/seed/new-${Date.now()}-${i}/800/600`,
    }));

    setImages((prev) => [...prev, ...newItems]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (idx: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[idx].previewUrl);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const canSubmit = content.trim().length > 0 && content.length <= MAX_CONTENT && !isPending;

  const onSubmit = () => {
    if (!canSubmit) return;
    mutate({
      content: content.trim(),
      images: images.map((img) => img.fakeUploadedUrl),
    });
  };

  return (
    <div className="max-w-[600px] mx-auto py-4">
      <div className="flex items-center justify-between mb-3 px-1">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1 text-c01-m text-gray-700 hover:text-gray-900 transition-colors"
          aria-label="뒤로가기"
        >
          <ArrowLeft size={18} />
          <span>뒤로</span>
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className={cn(
            'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-c01-m transition-colors',
            canSubmit
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed',
          )}
        >
          {isPending && <Loader2 className="animate-spin" size={14} />}
          <span>{isPending ? '게시 중...' : '게시'}</span>
        </button>
      </div>

      <div className="bg-background rounded-2xl border border-gray-100 p-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="무엇을 공유하고 싶나요?"
          maxLength={MAX_CONTENT + 100}
          className="w-full min-h-[200px] resize-none outline-none text-b03-r text-gray-800 placeholder:text-gray-400"
        />

        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-1 mt-3">
            {images.map((img, idx) => (
              <div
                key={img.previewUrl}
                className="relative aspect-square overflow-hidden rounded-lg"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.previewUrl} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
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
            disabled={images.length >= MAX_IMAGES}
            className={cn(
              'inline-flex items-center gap-1.5 text-c01-m transition-colors',
              images.length >= MAX_IMAGES
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-700 hover:text-gray-900',
            )}
          >
            <ImagePlus size={18} />
            <span>
              사진 {images.length}/{MAX_IMAGES}
            </span>
          </button>
          <span
            className={cn(
              'text-c01-r',
              content.length > MAX_CONTENT ? 'text-red-500' : 'text-gray-400',
            )}
          >
            {content.length}/{MAX_CONTENT}
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

      {isError && (
        <p className="text-c01-r text-red-500 mt-3 px-1">게시 실패: {(error as Error)?.message}</p>
      )}
    </div>
  );
}

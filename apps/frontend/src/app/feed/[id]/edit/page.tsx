'use client';

import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ImagePlus, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFeedPostQuery } from '@/hooks/feed/useFeedPostQuery';
import { useUpdateFeedPostMutation } from '@/hooks/feed/useUpdateFeedPostMutation';
import { useMyProfileQuery } from '@/hooks/my/useProfileQuery';
import LoginRequiredModal from '@/shared/ui/modal/LoginRequiredModal';

const MAX_IMAGES = 4;
const MAX_CONTENT = 2000;

interface ImageItem {
  url: string;
  isNew: boolean;
  previewUrl?: string;
}

interface FeedEditPageProps {
  params: { id: string };
}

export default function FeedEditPage({ params }: FeedEditPageProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const postId = Number(params.id);

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useMyProfileQuery({ retry: false });
  const isLogged = useMemo(
    () => !isProfileError && Boolean(profile?.nickname),
    [profile?.nickname, isProfileError],
  );

  const { data: post, isLoading, isError, error } = useFeedPostQuery(postId);

  const [content, setContent] = useState('');
  const [images, setImages] = useState<ImageItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    if (post && !hydrated) {
      setContent(post.content);
      setImages(post.images.map((url) => ({ url, isNew: false })));
      setHydrated(true);
    }
  }, [post, hydrated]);

  useEffect(() => {
    if (!isProfileLoading && !isLogged) {
      setLoginModalOpen(true);
    }
  }, [isProfileLoading, isLogged]);

  useEffect(() => {
    if (post && profile?.memberId && post.author.id !== profile.memberId) {
      router.replace(`/feed/${postId}`);
    }
  }, [post, profile?.memberId, router, postId]);

  const {
    mutate,
    isPending,
    isError: isMutateError,
    error: mutateError,
  } = useUpdateFeedPostMutation({
    onSuccess: () => router.replace(`/feed/${postId}`),
  });

  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
      });
    };
  }, [images]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const remaining = MAX_IMAGES - images.length;
    const accepted = files.slice(0, remaining);

    const newItems: ImageItem[] = accepted.map((file, i) => ({
      url: `https://picsum.photos/seed/edit-${Date.now()}-${i}/800/600`,
      previewUrl: URL.createObjectURL(file),
      isNew: true,
    }));

    setImages((prev) => [...prev, ...newItems]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (idx: number) => {
    setImages((prev) => {
      const target = prev[idx];
      if (target.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const isUnchanged = useMemo(() => {
    if (!post) return true;
    if (content !== post.content) return false;
    if (images.length !== post.images.length) return false;
    return images.every((img, i) => !img.isNew && img.url === post.images[i]);
  }, [content, images, post]);

  const canSubmit =
    hydrated &&
    content.trim().length > 0 &&
    content.length <= MAX_CONTENT &&
    !isPending &&
    !isUnchanged;

  const onSubmit = () => {
    if (!canSubmit || !post) return;
    mutate({
      id: postId,
      body: {
        content: content !== post.content ? content.trim() : undefined,
        images: images.map((img) => img.url),
      },
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
          <span>{isPending ? '저장 중...' : '저장'}</span>
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="animate-spin text-gray-500" size={28} />
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-2">
          <p className="text-b02-sb text-gray-700">게시글을 불러오지 못했어요.</p>
          <p className="text-c01-r text-gray-500">{error?.message}</p>
        </div>
      )}

      {post && (
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
                  key={img.previewUrl ?? img.url}
                  className="relative aspect-square overflow-hidden rounded-lg"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.previewUrl ?? img.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
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
      )}

      {isMutateError && (
        <p className="text-c01-r text-red-500 mt-3 px-1">
          저장 실패: {(mutateError as Error)?.message}
        </p>
      )}

      <LoginRequiredModal
        open={loginModalOpen}
        onOpenChange={(open) => {
          setLoginModalOpen(open);
          if (!open && !isLogged) {
            router.replace('/feed');
          }
        }}
        onConfirm={() => router.push('/login')}
        title="로그인이 필요해요"
        description="글을 수정하려면 로그인이 필요합니다."
        confirmText="로그인 하러가기"
        cancelText="피드로 돌아가기"
        showCancel
      />
    </div>
  );
}

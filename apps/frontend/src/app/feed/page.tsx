'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Pencil } from 'lucide-react';
import { FeedCard } from '@/shared/ui/feed-card/feed-card';
import type { FeedPost } from '@/shared/ui/feed-card/feed-card.types';
import { useFeedInfiniteQuery } from '@/hooks/feed/useFeedInfiniteQuery';
import { useToggleLikeMutation } from '@/hooks/feed/useToggleLikeMutation';
import { useMyProfileQuery } from '@/hooks/my/useProfileQuery';
import LoginRequiredModal from '@/shared/ui/modal/LoginRequiredModal';

export default function FeedPage() {
  const router = useRouter();
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFeedInfiniteQuery();
  const { data: profile, isError: isProfileError } = useMyProfileQuery({ retry: false });
  const isLogged = useMemo(
    () => !isProfileError && Boolean(profile?.nickname),
    [profile?.nickname, isProfileError],
  );

  const sentinelRef = useRef<HTMLDivElement>(null);
  const [loginModal, setLoginModal] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });

  const toggleLikeMutation = useToggleLikeMutation();

  const showLoginModal = (message: string) => {
    setLoginModal({ open: true, message });
  };

  const handleWriteClick = () => {
    if (isLogged) {
      router.push('/feed/new');
    } else {
      showLoginModal('글을 작성하려면 로그인이 필요합니다.');
    }
  };

  const handleLikeClick = (post: FeedPost) => {
    if (!isLogged) {
      showLoginModal('이 글에 좋아요를 누르려면 로그인이 필요합니다.');
      return;
    }
    toggleLikeMutation.mutate(post.id);
  };

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const items = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <>
      <div className="max-w-[600px] mx-auto py-6">
        {isLoading && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="animate-spin text-gray-500" size={32} />
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2">
            <p className="text-b02-sb text-gray-700">피드를 불러오지 못했어요.</p>
            <p className="text-c01-r text-gray-500">{error?.message}</p>
          </div>
        )}

        {!isLoading && !isError && items.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2">
            <p className="text-b02-sb text-gray-700">아직 게시글이 없어요</p>
            <p className="text-c01-r text-gray-500">첫 글을 작성해보세요!</p>
          </div>
        )}

        {!isLoading && !isError && items.length > 0 && (
          <>
            <div className="space-y-3">
              {items.map((post) => (
                <FeedCard
                  key={post.id}
                  post={post}
                  onCardClick={(p) => router.push(`/feed/${p.id}`)}
                  onLikeClick={handleLikeClick}
                />
              ))}
            </div>
            <div
              ref={sentinelRef}
              className="h-16 flex items-center justify-center"
              aria-hidden="true"
            >
              {isFetchingNextPage && <Loader2 className="animate-spin text-gray-500" size={20} />}
              {!hasNextPage && <p className="text-c01-r text-gray-400">마지막 글입니다</p>}
            </div>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={handleWriteClick}
        className="fixed bottom-5 right-5 z-30 w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        aria-label="피드 작성"
      >
        <Pencil size={18} />
      </button>

      <LoginRequiredModal
        open={loginModal.open}
        onOpenChange={(open) => setLoginModal((s) => ({ ...s, open }))}
        onConfirm={() => router.push('/login')}
        title="로그인이 필요해요"
        description={loginModal.message}
        confirmText="로그인 하러가기"
        cancelText="다음에"
        showCancel
      />
    </>
  );
}

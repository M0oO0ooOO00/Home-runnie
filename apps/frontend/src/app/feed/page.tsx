'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUp, Loader2, Pencil } from 'lucide-react';
import { FeedCard } from '@/shared/ui/feed-card/feed-card';
import type { FeedPost } from '@/shared/ui/feed-card/feed-card.types';
import { useFeedInfiniteQuery } from '@/hooks/feed/useFeedInfiniteQuery';
import { useToggleLikeMutation } from '@/hooks/feed/useToggleLikeMutation';
import { useDeleteFeedPostMutation } from '@/hooks/feed/useDeleteFeedPostMutation';
import { useMyProfileQuery } from '@/hooks/my/useProfileQuery';
import LoginRequiredModal from '@/shared/ui/modal/LoginRequiredModal';
import ConfirmModal from '@/shared/ui/modal/ConfirmModal';
import { cn } from '@/lib/utils';

export default function FeedPage() {
  const router = useRouter();
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFeedInfiniteQuery();
  const { data: profile, isError: isProfileError } = useMyProfileQuery({ retry: false });
  const isLogged = useMemo(
    () => !isProfileError && Boolean(profile?.nickname),
    [profile?.nickname, isProfileError],
  );

  const viewerMemberId = useMemo(
    () => (isLogged && profile?.memberId ? profile.memberId : null),
    [isLogged, profile?.memberId],
  );

  const pageRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [loginModal, setLoginModal] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });
  const [deleteTarget, setDeleteTarget] = useState<FeedPost | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [pinActionsToPageBottom, setPinActionsToPageBottom] = useState(false);

  const toggleLikeMutation = useToggleLikeMutation();
  const deletePostMutation = useDeleteFeedPostMutation({
    onSuccess: () => setDeleteTarget(null),
  });

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

  const handleScrollTopClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const items = data?.pages.flatMap((p) => p.items) ?? [];

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 320);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateActionPosition = () => {
      const page = pageRef.current;
      if (!page) return;

      const shouldPin = page.getBoundingClientRect().bottom <= window.innerHeight;
      setPinActionsToPageBottom((prev) => (prev === shouldPin ? prev : shouldPin));
    };

    updateActionPosition();
    window.addEventListener('scroll', updateActionPosition, { passive: true });
    window.addEventListener('resize', updateActionPosition);
    return () => {
      window.removeEventListener('scroll', updateActionPosition);
      window.removeEventListener('resize', updateActionPosition);
    };
  }, [items.length]);

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

  return (
    <div ref={pageRef} className="relative">
      <div className="mx-auto max-w-[680px] px-4 pb-28 pt-6 sm:px-6">
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
            <div className="space-y-5">
              {items.map((post) => (
                <FeedCard
                  key={post.id}
                  post={post}
                  viewerMemberId={viewerMemberId}
                  onCardClick={(p) => router.push(`/feed/${p.id}`)}
                  onLikeClick={handleLikeClick}
                  onEditClick={(p) => router.push(`/feed/${p.id}/edit`)}
                  onDeleteClick={(p) => setDeleteTarget(p)}
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
        className={cn(
          'left-1/2 z-30 inline-flex -translate-x-1/2 items-center gap-3 rounded-full bg-gray-950 px-7 py-4 text-b01-b text-white shadow-03 transition-colors hover:bg-gray-850 active:bg-gray-900 max-sm:gap-2.5 max-sm:px-5 max-sm:py-3 max-sm:text-b03-b',
          pinActionsToPageBottom
            ? 'absolute bottom-6 max-sm:bottom-5'
            : 'fixed bottom-6 max-sm:bottom-5',
        )}
        aria-label="피드 작성"
      >
        <Pencil size={26} strokeWidth={1.9} className="max-sm:size-5" />
        <span>글 작성하기</span>
      </button>

      {showScrollTop && (
        <button
          type="button"
          onClick={handleScrollTopClick}
          className={cn(
            'right-[max(1.5rem,calc(50%_-_430px))] z-30 flex size-11 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 active:bg-gray-100 max-sm:right-4 max-sm:size-9',
            pinActionsToPageBottom
              ? 'absolute bottom-8 max-sm:bottom-6'
              : 'fixed bottom-8 max-sm:bottom-6',
          )}
          aria-label="맨 위로 이동"
        >
          <ArrowUp size={22} strokeWidth={2.2} className="max-sm:size-5" />
        </button>
      )}

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

      <ConfirmModal
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={() => {
          if (deleteTarget) deletePostMutation.mutate(deleteTarget.id);
        }}
        title="게시글을 삭제하시겠어요?"
        description="삭제된 게시글은 복구할 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        destructive
        isPending={deletePostMutation.isPending}
      />
    </div>
  );
}

'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { FeedCard } from '@/shared/ui/feed-card/feed-card';
import type { FeedPost } from '@/shared/ui/feed-card/feed-card.types';
import { useFeedPostQuery } from '@/hooks/feed/useFeedPostQuery';
import { useToggleLikeMutation } from '@/hooks/feed/useToggleLikeMutation';
import { useMyProfileQuery } from '@/hooks/my/useProfileQuery';
import LoginRequiredModal from '@/shared/ui/modal/LoginRequiredModal';
import { CommentList } from './components/CommentList';

interface FeedDetailPageProps {
  params: { id: string };
}

export default function FeedDetailPage({ params }: FeedDetailPageProps) {
  const router = useRouter();
  const postId = Number(params.id);

  const { data: post, isLoading, isError, error } = useFeedPostQuery(postId);
  const { data: profile, isError: isProfileError } = useMyProfileQuery({ retry: false });
  const isLogged = useMemo(
    () => !isProfileError && Boolean(profile?.nickname),
    [profile?.nickname, isProfileError],
  );
  const viewerMemberId = useMemo(
    () => (isLogged && profile?.memberId ? profile.memberId : null),
    [isLogged, profile?.memberId],
  );

  const [loginModal, setLoginModal] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });

  const toggleLikeMutation = useToggleLikeMutation();

  const showLoginModal = (message: string) => {
    setLoginModal({ open: true, message });
  };

  const handleLikeClick = (p: FeedPost) => {
    if (!isLogged) {
      showLoginModal('이 글에 좋아요를 누르려면 로그인이 필요합니다.');
      return;
    }
    toggleLikeMutation.mutate(p.id);
  };

  return (
    <div className="max-w-[600px] mx-auto py-4">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-1 text-c01-m text-gray-700 hover:text-gray-900 transition-colors mb-3 px-1"
        aria-label="뒤로가기"
      >
        <ArrowLeft size={18} />
        <span>뒤로</span>
      </button>

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
        <>
          <FeedCard post={post} expanded onLikeClick={handleLikeClick} />

          <div className="mt-3">
            <CommentList
              postId={post.id}
              viewerMemberId={viewerMemberId}
              onAuthRequired={showLoginModal}
            />
          </div>
        </>
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
    </div>
  );
}

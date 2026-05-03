'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { FeedCard } from '@/shared/ui/feed-card/feed-card';
import { useFeedPostQuery } from '@/hooks/feed/useFeedPostQuery';

interface FeedDetailPageProps {
  params: { id: string };
}

export default function FeedDetailPage({ params }: FeedDetailPageProps) {
  const router = useRouter();
  const postId = Number(params.id);

  const { data: post, isLoading, isError, error } = useFeedPostQuery(postId);

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
          <FeedCard post={post} expanded />

          <section className="mt-3 bg-background rounded-2xl border border-gray-100 p-4">
            <h2 className="text-b02-sb text-gray-950">댓글 ({post.commentCount})</h2>
            <p className="text-c01-r text-gray-500 mt-3">댓글 기능 곧 출시 예정입니다.</p>
          </section>
        </>
      )}
    </div>
  );
}

'use client';

import { Loader2 } from 'lucide-react';
import type { Team } from '@homerunnie/shared';
import type { FeedComment } from '@/apis/feed/comment';
import { formatCompactCount } from '@/lib/format';
import { CommentInput } from './CommentInput';
import { CommentItem } from './CommentItem';
import type { CommentItemActions } from './comment.types';

interface CommentListViewProps {
  comments?: FeedComment[];
  queryState: {
    isLoading: boolean;
    isError: boolean;
    errorMessage?: string;
  };
  composer: {
    isLogged: boolean;
    isSubmitting: boolean;
    supportTeam?: Team | string | null;
    onSubmit: (content: string) => void;
  };
  actions: CommentItemActions;
}

export function CommentListView({ comments, queryState, composer, actions }: CommentListViewProps) {
  const commentItems = comments ?? [];
  const totalCount = commentItems.reduce((acc, comment) => acc + 1 + comment.replies.length, 0);

  return (
    <section className="mx-auto mt-16 w-full max-w-[585px]">
      <div className="mb-8 flex items-center gap-5">
        <h2 className="text-t04-b text-gray-950">댓글</h2>
        <span className="text-b01-sb text-gray-400">{formatCompactCount(totalCount)}</span>
      </div>

      <CommentInput
        placeholder={
          composer.isLogged
            ? '지금 무슨 생각을 하고 계신가요?'
            : '로그인 후 댓글을 작성할 수 있어요'
        }
        isSubmitting={composer.isSubmitting}
        supportTeam={composer.supportTeam}
        variant="composer"
        submitLabel="게시하기"
        submittingLabel="게시 중"
        onSubmit={composer.onSubmit}
      />

      <div className="mt-[10px] rounded-[28px] bg-card px-5 py-7 shadow-02 sm:px-8 sm:py-9">
        {queryState.isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin text-gray-500" size={20} />
          </div>
        )}

        {queryState.isError && (
          <p className="py-8 text-center text-c01-r text-red-500">
            댓글을 불러오지 못했어요. {queryState.errorMessage}
          </p>
        )}

        {!queryState.isLoading && !queryState.isError && commentItems.length === 0 && (
          <p className="py-8 text-center text-c01-r text-gray-400">아직 댓글이 없어요</p>
        )}

        {commentItems.length > 0 && (
          <div className="flex flex-col gap-12">
            {commentItems.map((comment) => (
              <CommentItem key={comment.id} comment={comment} actions={actions} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

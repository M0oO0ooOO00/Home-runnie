'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { Team } from '@homerunnie/shared';
import { useFeedCommentsQuery } from '@/hooks/feed/useFeedCommentsQuery';
import { useCreateFeedCommentMutation } from '@/hooks/feed/useCreateFeedCommentMutation';
import { useDeleteFeedCommentMutation } from '@/hooks/feed/useDeleteFeedCommentMutation';
import { useUpdateFeedCommentMutation } from '@/hooks/feed/useUpdateFeedCommentMutation';
import { useToggleFeedCommentLikeMutation } from '@/hooks/feed/useToggleFeedCommentLikeMutation';
import { CommentInput } from './CommentInput';
import { CommentItem } from './CommentItem';

interface CommentListProps {
  postId: number;
  viewerMemberId: number | null;
  viewerSupportTeam?: Team | string | null;
  onAuthRequired: (message: string) => void;
}

function formatCompactCount(count: number): string {
  if (count >= 1_000_000) return `${Number((count / 1_000_000).toFixed(1))}m`;
  if (count >= 1_000) return `${Number((count / 1_000).toFixed(1))}k`;
  return String(count);
}

export function CommentList({
  postId,
  viewerMemberId,
  viewerSupportTeam,
  onAuthRequired,
}: CommentListProps) {
  const { data: comments, isLoading, isError, error } = useFeedCommentsQuery(postId);
  const createMutation = useCreateFeedCommentMutation(postId);
  const deleteMutation = useDeleteFeedCommentMutation(postId);
  const updateMutation = useUpdateFeedCommentMutation(postId);
  const toggleCommentLikeMutation = useToggleFeedCommentLikeMutation(postId);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const isLogged = viewerMemberId !== null;

  const handleRootSubmit = (content: string) => {
    if (!isLogged) {
      onAuthRequired('댓글을 작성하려면 로그인이 필요합니다.');
      return;
    }
    createMutation.mutate({ content });
  };

  const handleReplySubmit = (parentId: number, content: string) => {
    if (!isLogged) {
      onAuthRequired('답글을 작성하려면 로그인이 필요합니다.');
      return;
    }
    createMutation.mutate(
      { content, parentId },
      {
        onSuccess: () => setReplyingTo(null),
      },
    );
  };

  const handleDelete = (commentId: number) => {
    deleteMutation.mutate(commentId);
  };

  const handleUpdate = (commentId: number, content: string) => {
    updateMutation.mutate({ commentId, content });
  };

  const handleReplyToggle = (commentId: number) => {
    setReplyingTo((prev) => (prev === commentId ? null : commentId));
  };

  const handleCommentLike = (commentId: number) => {
    if (!isLogged) {
      onAuthRequired('댓글에 좋아요를 누르려면 로그인이 필요합니다.');
      return;
    }
    toggleCommentLikeMutation.mutate(commentId);
  };

  const handleAuthRequired = () => {
    onAuthRequired('답글을 작성하려면 로그인이 필요합니다.');
  };

  const totalCount = comments?.reduce((acc, c) => acc + 1 + c.replies.length, 0) ?? 0;

  return (
    <section className="mx-auto mt-16 w-full max-w-[585px]">
      <div className="mb-8 flex items-center gap-5">
        <h2 className="text-t04-b text-gray-950">댓글</h2>
        <span className="text-b01-sb text-gray-400">{formatCompactCount(totalCount)}</span>
      </div>

      <CommentInput
        placeholder={
          isLogged ? '지금 무슨 생각을 하고 계신가요?' : '로그인 후 댓글을 작성할 수 있어요'
        }
        isSubmitting={createMutation.isPending && replyingTo === null}
        supportTeam={viewerSupportTeam}
        variant="composer"
        submitLabel="게시하기"
        submittingLabel="게시 중"
        onSubmit={handleRootSubmit}
      />

      <div className="mt-[10px] rounded-[28px] bg-card px-5 py-7 shadow-02 sm:px-8 sm:py-9">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin text-gray-500" size={20} />
          </div>
        )}

        {isError && (
          <p className="py-8 text-center text-c01-r text-red-500">
            댓글을 불러오지 못했어요. {error?.message}
          </p>
        )}

        {!isLoading && !isError && (comments?.length ?? 0) === 0 && (
          <p className="py-8 text-center text-c01-r text-gray-400">아직 댓글이 없어요</p>
        )}

        {comments && comments.length > 0 && (
          <div className="flex flex-col gap-12">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                viewerMemberId={viewerMemberId}
                isReplyingTarget={replyingTo === comment.id}
                isCreatingReply={createMutation.isPending && replyingTo === comment.id}
                isUpdatingComment={updateMutation.isPending}
                onReplyToggle={handleReplyToggle}
                onReplySubmit={handleReplySubmit}
                onLikeClick={handleCommentLike}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                onAuthRequired={handleAuthRequired}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

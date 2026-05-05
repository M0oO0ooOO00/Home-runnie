'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useFeedCommentsQuery } from '@/hooks/feed/useFeedCommentsQuery';
import { useCreateFeedCommentMutation } from '@/hooks/feed/useCreateFeedCommentMutation';
import { useDeleteFeedCommentMutation } from '@/hooks/feed/useDeleteFeedCommentMutation';
import { CommentInput } from './CommentInput';
import { CommentItem } from './CommentItem';

interface CommentListProps {
  postId: number;
  viewerMemberId: number | null;
  onAuthRequired: (message: string) => void;
}

export function CommentList({ postId, viewerMemberId, onAuthRequired }: CommentListProps) {
  const { data: comments, isLoading, isError, error } = useFeedCommentsQuery(postId);
  const createMutation = useCreateFeedCommentMutation(postId);
  const deleteMutation = useDeleteFeedCommentMutation(postId);
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

  const handleReplyToggle = (commentId: number) => {
    setReplyingTo((prev) => (prev === commentId ? null : commentId));
  };

  const handleAuthRequired = () => {
    onAuthRequired('답글을 작성하려면 로그인이 필요합니다.');
  };

  const totalCount = comments?.reduce((acc, c) => acc + 1 + c.replies.length, 0) ?? 0;

  return (
    <section className="bg-background rounded-2xl border border-gray-100 p-4">
      <h2 className="text-b02-sb text-gray-950 mb-3">댓글 ({totalCount})</h2>

      <CommentInput
        placeholder={isLogged ? '댓글을 입력하세요' : '로그인 후 댓글을 작성할 수 있어요'}
        isSubmitting={createMutation.isPending && replyingTo === null}
        onSubmit={handleRootSubmit}
      />

      <div className="mt-4 flex flex-col gap-4">
        {isLoading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="animate-spin text-gray-500" size={20} />
          </div>
        )}

        {isError && (
          <p className="text-c01-r text-red-500 text-center py-4">
            댓글을 불러오지 못했어요. {error?.message}
          </p>
        )}

        {!isLoading && !isError && (comments?.length ?? 0) === 0 && (
          <p className="text-c01-r text-gray-400 text-center py-4">아직 댓글이 없어요</p>
        )}

        {comments?.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            viewerMemberId={viewerMemberId}
            isReplyingTarget={replyingTo === comment.id}
            isCreatingReply={createMutation.isPending && replyingTo === comment.id}
            onReplyToggle={handleReplyToggle}
            onReplySubmit={handleReplySubmit}
            onDelete={handleDelete}
            onAuthRequired={handleAuthRequired}
          />
        ))}
      </div>
    </section>
  );
}

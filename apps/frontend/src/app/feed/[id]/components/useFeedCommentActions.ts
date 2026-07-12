'use client';

import { useCallback, useMemo, useState } from 'react';
import { useCreateFeedCommentMutation } from '@/hooks/feed/useCreateFeedCommentMutation';
import { useDeleteFeedCommentMutation } from '@/hooks/feed/useDeleteFeedCommentMutation';
import { useToggleFeedCommentLikeMutation } from '@/hooks/feed/useToggleFeedCommentLikeMutation';
import { useUpdateFeedCommentMutation } from '@/hooks/feed/useUpdateFeedCommentMutation';
import { showToast, ToastIconType } from '@/shared/ui/toast/toast';
import type { CommentItemActions, CommentSubmitValue } from './comment.types';

interface UseFeedCommentActionsOptions {
  postId: number;
  viewerMemberId: number | null;
  onAuthRequired: (message: string) => void;
}

export function useFeedCommentActions({
  postId,
  viewerMemberId,
  onAuthRequired,
}: UseFeedCommentActionsOptions) {
  const { mutate: createComment, isPending: isCreatingComment } = useCreateFeedCommentMutation(
    postId,
    {
      onError: (error) => showToast(error.message || '댓글 작성에 실패했어요.', ToastIconType.INFO),
    },
  );
  const { mutate: deleteCommentMutation } = useDeleteFeedCommentMutation(postId);
  const { mutate: updateCommentMutation, isPending: isUpdatingComment } =
    useUpdateFeedCommentMutation(postId, {
      onError: (error) => showToast(error.message || '댓글 수정에 실패했어요.', ToastIconType.INFO),
    });
  const { mutate: toggleCommentLike } = useToggleFeedCommentLikeMutation(postId);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const isLogged = viewerMemberId !== null;

  const submitRootComment = useCallback(
    ({ content, imageFile }: CommentSubmitValue) => {
      if (!isLogged) {
        onAuthRequired('댓글을 작성하려면 로그인이 필요합니다.');
        return;
      }
      createComment({ content, imageFile });
    },
    [createComment, isLogged, onAuthRequired],
  );

  const submitReply = useCallback(
    (parentId: number, { content, imageFile }: CommentSubmitValue) => {
      if (!isLogged) {
        onAuthRequired('답글을 작성하려면 로그인이 필요합니다.');
        return;
      }
      createComment(
        { content, imageFile, parentId },
        {
          onSuccess: () => setReplyingTo(null),
        },
      );
    },
    [createComment, isLogged, onAuthRequired],
  );

  const deleteComment = useCallback(
    (commentId: number) => {
      deleteCommentMutation(commentId);
    },
    [deleteCommentMutation],
  );

  const updateComment = useCallback(
    (commentId: number, { content, imageFile, imageUrl }: CommentSubmitValue) => {
      updateCommentMutation({ commentId, content, imageFile, imageUrl });
    },
    [updateCommentMutation],
  );

  const toggleReply = useCallback(
    (commentId: number) => {
      if (!isLogged) {
        onAuthRequired('답글을 작성하려면 로그인이 필요합니다.');
        return;
      }
      setReplyingTo((prev) => (prev === commentId ? null : commentId));
    },
    [isLogged, onAuthRequired],
  );

  const likeComment = useCallback(
    (commentId: number) => {
      if (!isLogged) {
        onAuthRequired('댓글에 좋아요를 누르려면 로그인이 필요합니다.');
        return;
      }
      toggleCommentLike(commentId);
    },
    [isLogged, onAuthRequired, toggleCommentLike],
  );

  const commentActions = useMemo<CommentItemActions>(
    () => ({
      toggleReply,
      submitReply,
      like: likeComment,
      delete: deleteComment,
      update: updateComment,
    }),
    [deleteComment, likeComment, submitReply, toggleReply, updateComment],
  );

  const interactionValue = useMemo(
    () => ({
      viewerMemberId,
      replyingTo,
      isCreatingReply: (commentId: number) => isCreatingComment && replyingTo === commentId,
      isUpdatingComment,
    }),
    [isCreatingComment, isUpdatingComment, replyingTo, viewerMemberId],
  );

  return {
    commentsQueryState: {
      isRootCommentSubmitting: isCreatingComment && replyingTo === null,
    },
    commentActions,
    interactionValue,
    isLogged,
    submitRootComment,
  };
}

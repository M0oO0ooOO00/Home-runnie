'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleLike, type ToggleLikeResponse } from '@/apis/reaction/reaction';
import type { FeedComment } from '@/apis/feed/comment';

interface ToggleCommentContext {
  previousComments?: FeedComment[];
}

function applyToCommentTree(
  comments: FeedComment[],
  commentId: number,
  updater: (comment: FeedComment) => FeedComment,
): FeedComment[] {
  return comments.map((comment) => {
    if (comment.id === commentId) return updater(comment);
    if (comment.replies.length === 0) return comment;
    return {
      ...comment,
      replies: applyToCommentTree(comment.replies, commentId, updater),
    };
  });
}

function applyOptimisticToggle(comment: FeedComment): FeedComment {
  const wasLiked = Boolean(comment.isLiked);
  return {
    ...comment,
    isLiked: !wasLiked,
    likeCount: Math.max(0, (comment.likeCount ?? 0) + (wasLiked ? -1 : 1)),
  };
}

export const useToggleFeedCommentLikeMutation = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation<ToggleLikeResponse, Error, number, ToggleCommentContext>({
    mutationFn: (commentId) => toggleLike('COMMENT', commentId),

    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: ['feed-comments', postId] });
      const previousComments = queryClient.getQueryData<FeedComment[]>(['feed-comments', postId]);

      queryClient.setQueryData<FeedComment[]>(['feed-comments', postId], (old) =>
        old ? applyToCommentTree(old, commentId, applyOptimisticToggle) : old,
      );

      return { previousComments };
    },

    onError: (_err, _commentId, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(['feed-comments', postId], context.previousComments);
      }
    },

    onSuccess: (data, commentId) => {
      queryClient.setQueryData<FeedComment[]>(['feed-comments', postId], (old) =>
        old
          ? applyToCommentTree(old, commentId, (comment) => ({
              ...comment,
              isLiked: data.liked,
              likeCount: data.likeCount,
            }))
          : old,
      );
    },
  });
};

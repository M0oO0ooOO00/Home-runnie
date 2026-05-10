'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateFeedComment, type FeedComment } from '@/apis/feed/comment';

interface Variables {
  commentId: number;
  content: string;
}

interface Options {
  onSuccess?: (comment: FeedComment) => void;
  onError?: (error: Error) => void;
}

export const useUpdateFeedCommentMutation = (
  postId: number,
  { onSuccess, onError }: Options = {},
) => {
  const queryClient = useQueryClient();

  return useMutation<FeedComment, Error, Variables>({
    mutationFn: ({ commentId, content }) => updateFeedComment(postId, commentId, { content }),
    onSuccess: (comment) => {
      queryClient.invalidateQueries({ queryKey: ['feed-comments', postId] });
      onSuccess?.(comment);
    },
    onError,
  });
};

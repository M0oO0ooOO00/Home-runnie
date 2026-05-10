'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteFeedPost, type GetFeedPostsResponse } from '@/apis/feed/feed';

interface Options {
  onSuccess?: (postId: number) => void;
  onError?: (error: Error) => void;
}

export const useDeleteFeedPostMutation = ({ onSuccess, onError }: Options = {}) => {
  const queryClient = useQueryClient();

  return useMutation<{ id: number }, Error, number>({
    mutationFn: (postId) => deleteFeedPost(postId),
    onSuccess: (_, postId) => {
      queryClient.removeQueries({ queryKey: ['feed-post', postId] });

      queryClient.setQueriesData<{
        pages: GetFeedPostsResponse[];
        pageParams: (string | null)[];
      }>({ queryKey: ['feed'] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.filter((item) => item.id !== postId),
          })),
        };
      });

      onSuccess?.(postId);
    },
    onError,
  });
};

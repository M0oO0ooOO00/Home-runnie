'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateFeedPost, type UpdateFeedPostRequest } from '@/apis/feed/feed';
import type { GetFeedPostsResponse } from '@/apis/feed/feed';
import type { FeedPost } from '@/shared/ui/feed-card/feed-card.types';

interface Variables {
  id: number;
  body: UpdateFeedPostRequest;
}

interface Options {
  onSuccess?: (post: FeedPost) => void;
  onError?: (error: Error) => void;
}

export const useUpdateFeedPostMutation = ({ onSuccess, onError }: Options = {}) => {
  const queryClient = useQueryClient();

  return useMutation<FeedPost, Error, Variables>({
    mutationFn: ({ id, body }) => updateFeedPost(id, body),
    onSuccess: (post) => {
      queryClient.setQueryData<FeedPost>(['feed-post', post.id], post);

      queryClient.setQueriesData<{
        pages: GetFeedPostsResponse[];
        pageParams: (string | null)[];
      }>({ queryKey: ['feed'] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.map((item) => (item.id === post.id ? post : item)),
          })),
        };
      });

      onSuccess?.(post);
    },
    onError,
  });
};

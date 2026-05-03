'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFeedPost, type CreateFeedPostRequest } from '@/apis/feed/feed';
import type { FeedPost } from '@/shared/ui/feed-card/feed-card.types';

interface Options {
  onSuccess?: (post: FeedPost) => void;
  onError?: (error: Error) => void;
}

export const useCreateFeedPostMutation = ({ onSuccess, onError }: Options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateFeedPostRequest) => createFeedPost(body),
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      onSuccess?.(post);
    },
    onError,
  });
};

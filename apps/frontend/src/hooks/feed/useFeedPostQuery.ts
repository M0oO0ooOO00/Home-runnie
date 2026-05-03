'use client';

import { useQuery } from '@tanstack/react-query';
import { getFeedPostById } from '@/apis/feed/feed';

export const useFeedPostQuery = (postId: number) => {
  return useQuery({
    queryKey: ['feed-post', postId],
    queryFn: () => getFeedPostById(postId),
    enabled: Number.isFinite(postId) && postId > 0,
  });
};

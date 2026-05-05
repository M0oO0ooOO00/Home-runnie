'use client';

import { useQuery } from '@tanstack/react-query';
import { getFeedComments } from '@/apis/feed/comment';

export const useFeedCommentsQuery = (postId: number) => {
  return useQuery({
    queryKey: ['feed-comments', postId],
    queryFn: () => getFeedComments(postId),
    enabled: Number.isFinite(postId) && postId > 0,
  });
};

'use client';

import { useQuery } from '@tanstack/react-query';
import { getFeedPostById } from '@/apis/feed/feed';
import type { FeedPost } from '@/shared/ui/feed-card/feed-card.types';

export const useFeedPostQuery = (postId: number, initialData?: FeedPost | null) => {
  return useQuery({
    queryKey: ['feed-post', postId],
    queryFn: () => getFeedPostById(postId),
    enabled: Number.isFinite(postId) && postId > 0,
    initialData: initialData ?? undefined,
  });
};

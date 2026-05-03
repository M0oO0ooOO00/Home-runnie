'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getFeedPosts, type GetFeedPostsResponse } from '@/apis/feed/feed';

export const useFeedInfiniteQuery = (limit = 10) => {
  return useInfiniteQuery<
    GetFeedPostsResponse,
    Error,
    { pages: GetFeedPostsResponse[]; pageParams: (string | null)[] },
    [string, { limit: number }],
    string | null
  >({
    queryKey: ['feed', { limit }],
    queryFn: ({ pageParam }) => getFeedPosts({ cursor: pageParam, limit }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};

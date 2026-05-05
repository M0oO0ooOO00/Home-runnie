'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleLike, type ToggleLikeResponse } from '@/apis/reaction/reaction';
import type { GetFeedPostsResponse } from '@/apis/feed/feed';
import type { FeedPost } from '@/shared/ui/feed-card/feed-card.types';

interface ToggleContext {
  previousDetail?: FeedPost;
  previousFeedQueries: { queryKey: unknown[]; data: unknown }[];
}

function applyToggleToPost(post: FeedPost): FeedPost {
  return {
    ...post,
    isLiked: !post.isLiked,
    likeCount: Math.max(0, post.likeCount + (post.isLiked ? -1 : 1)),
  };
}

export const useToggleLikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ToggleLikeResponse, Error, number, ToggleContext>({
    mutationFn: (postId) => toggleLike('POST', postId),

    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['feed'] });
      await queryClient.cancelQueries({ queryKey: ['feed-post', postId] });

      const previousDetail = queryClient.getQueryData<FeedPost>(['feed-post', postId]);

      const feedSnapshots = queryClient.getQueriesData<{
        pages: GetFeedPostsResponse[];
        pageParams: (string | null)[];
      }>({ queryKey: ['feed'] });
      const previousFeedQueries = feedSnapshots.map(([queryKey, data]) => ({
        queryKey: queryKey as unknown[],
        data,
      }));

      if (previousDetail) {
        queryClient.setQueryData<FeedPost>(
          ['feed-post', postId],
          applyToggleToPost(previousDetail),
        );
      }

      queryClient.setQueriesData<{
        pages: GetFeedPostsResponse[];
        pageParams: (string | null)[];
      }>({ queryKey: ['feed'] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.map((item) => (item.id === postId ? applyToggleToPost(item) : item)),
          })),
        };
      });

      return { previousDetail, previousFeedQueries };
    },

    onError: (_err, postId, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(['feed-post', postId], context.previousDetail);
      }
      context?.previousFeedQueries.forEach(({ queryKey, data }) => {
        queryClient.setQueryData(queryKey, data);
      });
    },

    onSuccess: (data, postId) => {
      queryClient.setQueryData<FeedPost>(['feed-post', postId], (old) =>
        old ? { ...old, isLiked: data.liked, likeCount: data.likeCount } : old,
      );

      queryClient.setQueriesData<{
        pages: GetFeedPostsResponse[];
        pageParams: (string | null)[];
      }>({ queryKey: ['feed'] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.map((item) =>
              item.id === postId
                ? { ...item, isLiked: data.liked, likeCount: data.likeCount }
                : item,
            ),
          })),
        };
      });
    },
  });
};

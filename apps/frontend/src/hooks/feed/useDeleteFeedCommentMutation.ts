'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteFeedComment } from '@/apis/feed/comment';
import type { GetFeedPostsResponse } from '@/apis/feed/feed';
import type { FeedPost } from '@/shared/ui/feed-card/feed-card.types';

export const useDeleteFeedCommentMutation = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation<{ id: number }, Error, number>({
    mutationFn: (commentId) => deleteFeedComment(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed-comments', postId] });

      queryClient.setQueryData<FeedPost>(['feed-post', postId], (old) =>
        old ? { ...old, commentCount: Math.max(0, old.commentCount - 1) } : old,
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
                ? { ...item, commentCount: Math.max(0, item.commentCount - 1) }
                : item,
            ),
          })),
        };
      });
    },
  });
};

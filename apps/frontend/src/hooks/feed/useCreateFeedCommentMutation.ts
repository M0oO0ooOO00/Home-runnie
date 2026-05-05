'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createFeedComment,
  type CreateFeedCommentRequest,
  type FeedComment,
} from '@/apis/feed/comment';
import type { GetFeedPostsResponse } from '@/apis/feed/feed';
import type { FeedPost } from '@/shared/ui/feed-card/feed-card.types';

export const useCreateFeedCommentMutation = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation<FeedComment, Error, CreateFeedCommentRequest>({
    mutationFn: (body) => createFeedComment(postId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed-comments', postId] });

      queryClient.setQueryData<FeedPost>(['feed-post', postId], (old) =>
        old ? { ...old, commentCount: old.commentCount + 1 } : old,
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
              item.id === postId ? { ...item, commentCount: item.commentCount + 1 } : item,
            ),
          })),
        };
      });
    },
  });
};

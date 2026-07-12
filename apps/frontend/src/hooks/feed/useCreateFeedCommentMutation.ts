'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createFeedComment,
  type CreateFeedCommentRequest,
  type FeedComment,
} from '@/apis/feed/comment';
import { uploadImages } from '@/apis/upload/upload';
import type { GetFeedPostsResponse } from '@/apis/feed/feed';
import type { FeedPost } from '@/shared/ui/feed-card/feed-card.types';

export interface CreateFeedCommentVariables extends Omit<CreateFeedCommentRequest, 'imageUrl'> {
  imageFile?: File;
}

interface Options {
  onError?: (error: Error) => void;
}

function appendComment(comments: FeedComment[], comment: FeedComment): FeedComment[] {
  if (comment.parentId === null) {
    return [...comments, comment];
  }

  return comments.map((item) => {
    if (item.id === comment.parentId) {
      return {
        ...item,
        replies: [...item.replies, comment],
      };
    }

    if (item.replies.length === 0) return item;

    return {
      ...item,
      replies: appendComment(item.replies, comment),
    };
  });
}

export const useCreateFeedCommentMutation = (postId: number, { onError }: Options = {}) => {
  const queryClient = useQueryClient();

  return useMutation<FeedComment, Error, CreateFeedCommentVariables>({
    mutationFn: async ({ imageFile, ...body }) => {
      const imageUrl = imageFile ? (await uploadImages([imageFile])).urls[0] : undefined;
      if (imageFile && !imageUrl) {
        throw new Error('이미지 업로드 결과를 확인할 수 없습니다.');
      }

      return createFeedComment(postId, { ...body, imageUrl });
    },
    onSuccess: (comment) => {
      queryClient.setQueryData<FeedComment[]>(['feed-comments', postId], (old) =>
        old ? appendComment(old, comment) : old,
      );
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
    onError,
  });
};

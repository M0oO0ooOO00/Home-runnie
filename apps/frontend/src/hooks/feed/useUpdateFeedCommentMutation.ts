'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateFeedComment, type FeedComment } from '@/apis/feed/comment';
import { uploadImages } from '@/apis/upload/upload';

interface Variables {
  commentId: number;
  content: string;
  imageFile?: File;
  imageUrl?: string | null;
}

interface Options {
  onSuccess?: (comment: FeedComment) => void;
  onError?: (error: Error) => void;
}

function replaceComment(comments: FeedComment[], updated: FeedComment): FeedComment[] {
  return comments.map((comment) => {
    if (comment.id === updated.id) {
      return {
        ...updated,
        replies: comment.replies,
      };
    }

    if (comment.replies.length === 0) return comment;

    return {
      ...comment,
      replies: replaceComment(comment.replies, updated),
    };
  });
}

export const useUpdateFeedCommentMutation = (
  postId: number,
  { onSuccess, onError }: Options = {},
) => {
  const queryClient = useQueryClient();

  return useMutation<FeedComment, Error, Variables>({
    mutationFn: async ({ commentId, content, imageFile, imageUrl }) => {
      const nextImageUrl = imageFile ? (await uploadImages([imageFile])).urls[0] : imageUrl;
      if (imageFile && !nextImageUrl) {
        throw new Error('이미지 업로드 결과를 확인할 수 없습니다.');
      }

      return updateFeedComment(postId, commentId, { content, imageUrl: nextImageUrl });
    },
    onSuccess: (comment) => {
      queryClient.setQueryData<FeedComment[]>(['feed-comments', postId], (old) =>
        old ? replaceComment(old, comment) : old,
      );
      queryClient.invalidateQueries({ queryKey: ['feed-comments', postId] });
      onSuccess?.(comment);
    },
    onError,
  });
};

import { apiClient } from '@/lib/fetchClient';
import type { FeedAuthor } from '@/shared/ui/feed-card/feed-card.types';

export interface FeedComment {
  id: number;
  author: FeedAuthor;
  content: string;
  parentId: number | null;
  replies: FeedComment[];
  createdAt: string;
}

export interface CreateFeedCommentRequest {
  content: string;
  parentId?: number;
}

export async function getFeedComments(postId: number): Promise<FeedComment[]> {
  return apiClient.get<FeedComment[]>(`/post/feed/${postId}/comments`);
}

export async function createFeedComment(
  postId: number,
  body: CreateFeedCommentRequest,
): Promise<FeedComment> {
  return apiClient.post<FeedComment>(`/post/feed/${postId}/comments`, body, {
    authRequired: true,
  });
}

export async function deleteFeedComment(
  postId: number,
  commentId: number,
): Promise<{ id: number }> {
  return apiClient.delete<{ id: number }>(`/post/feed/${postId}/comments/${commentId}`, {
    authRequired: true,
  });
}

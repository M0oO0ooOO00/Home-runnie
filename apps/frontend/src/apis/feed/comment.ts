import { apiClient } from '@/lib/fetchClient';
import type { FeedAuthor } from '@/shared/ui/feed-card/feed-card.types';

export interface FeedComment {
  id: number;
  author: FeedAuthor;
  content: string;
  imageUrl: string | null;
  parentId: number | null;
  replies: FeedComment[];
  createdAt: string;
  likeCount?: number;
  isLiked?: boolean;
}

export interface CreateFeedCommentRequest {
  content?: string;
  imageUrl?: string;
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

export interface UpdateFeedCommentRequest {
  content?: string;
  imageUrl?: string | null;
}

export async function updateFeedComment(
  postId: number,
  commentId: number,
  body: UpdateFeedCommentRequest,
): Promise<FeedComment> {
  return apiClient.patch<FeedComment>(`/post/feed/${postId}/comments/${commentId}`, body, {
    authRequired: true,
  });
}

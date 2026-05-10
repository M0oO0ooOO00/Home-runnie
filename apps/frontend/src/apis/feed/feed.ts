import { apiClient } from '@/lib/fetchClient';
import type { FeedPost } from '@/shared/ui/feed-card/feed-card.types';

export interface GetFeedPostsResponse {
  items: FeedPost[];
  nextCursor: string | null;
}

export interface GetFeedPostsParams {
  cursor?: string | null;
  limit?: number;
}

export async function getFeedPosts(params: GetFeedPostsParams = {}): Promise<GetFeedPostsResponse> {
  const { cursor, limit = 20 } = params;
  const query = new URLSearchParams();
  if (cursor) query.set('cursor', cursor);
  query.set('limit', String(limit));
  return apiClient.get<GetFeedPostsResponse>(`/post/feed?${query.toString()}`);
}

export async function getFeedPostById(id: number): Promise<FeedPost> {
  return apiClient.get<FeedPost>(`/post/feed/${id}`);
}

export interface CreateFeedPostRequest {
  content: string;
  images?: string[];
}

export async function createFeedPost(body: CreateFeedPostRequest): Promise<FeedPost> {
  return apiClient.post<FeedPost>('/post/feed', body, { authRequired: true });
}

export interface UpdateFeedPostRequest {
  content?: string;
  images?: string[];
}

export async function updateFeedPost(id: number, body: UpdateFeedPostRequest): Promise<FeedPost> {
  return apiClient.patch<FeedPost>(`/post/feed/${id}`, body, { authRequired: true });
}

export async function deleteFeedPost(id: number): Promise<{ id: number }> {
  return apiClient.delete<{ id: number }>(`/post/feed/${id}`, { authRequired: true });
}

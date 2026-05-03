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

export const FEED_POST_READER = Symbol('FEED_POST_READER');
export const FEED_POST_WRITER = Symbol('FEED_POST_WRITER');
export const FEED_POST_DELETER = Symbol('FEED_POST_DELETER');

export interface FeedPostQueryResult {
  id: number;
  authorId: number;
  authorNickname: string | null;
  supportTeam: string | null;
  content: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FeedPostMeta {
  id: number;
  authorId: number;
}

export interface FeedPostReader {
  findFeedPostMeta(postId: number): Promise<FeedPostMeta | null>;
  findFeedPostById(postId: number): Promise<FeedPostQueryResult | null>;
  findFeedPosts(cursorId: number | null, limit: number): Promise<FeedPostQueryResult[]>;
}

export interface FeedPostWriter {
  createFeedPost(authorId: number, content: string, images: string[]): Promise<{ id: number }>;
  updateFeedPost(postId: number, patch: { content?: string; images?: string[] }): Promise<void>;
}

export interface FeedPostDeleter {
  softDelete(postId: number): Promise<{ id: number } | null>;
}

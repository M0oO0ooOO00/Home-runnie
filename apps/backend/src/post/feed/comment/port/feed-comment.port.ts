export const FEED_COMMENT_READER = Symbol('FEED_COMMENT_READER');
export const FEED_COMMENT_WRITER = Symbol('FEED_COMMENT_WRITER');
export const FEED_COMMENT_COUNTER = Symbol('FEED_COMMENT_COUNTER');

export interface FeedCommentQueryResult {
  id: number;
  authorId: number;
  authorNickname: string | null;
  supportTeam: string | null;
  content: string;
  parentId: number | null;
  createdAt: Date;
}

export interface FeedCommentMeta {
  id: number;
  authorId: number;
  postId: number;
  parentId: number | null;
  deleted: boolean | null;
}

export interface FeedCommentReader {
  assertPostIsFeed(postId: number): Promise<boolean>;
  findCommentById(commentId: number): Promise<FeedCommentMeta | null>;
  findFeedCommentJoined(commentId: number): Promise<FeedCommentQueryResult | null>;
  findCommentsByPostId(postId: number): Promise<FeedCommentQueryResult[]>;
}

export interface FeedCommentWriter {
  createComment(
    authorId: number,
    postId: number,
    content: string,
    parentId: number | null,
  ): Promise<{ id: number } | undefined>;
  updateCommentContent(commentId: number, content: string): Promise<void>;
  softDeleteComment(commentId: number): Promise<void>;
}

export interface FeedCommentCounter {
  countCommentsByPostIds(postIds: number[]): Promise<Record<number, number>>;
}

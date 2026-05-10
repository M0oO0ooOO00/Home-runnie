import type { Team } from '@homerunnie/shared';

export interface FeedAuthor {
  type: 'member';
  id: number;
  nickname: string;
  supportTeam: Team | null;
}

export interface FeedPost {
  id: number;
  author: FeedAuthor;
  content: string;
  images: string[];
  likeCount: number;
  isLiked: boolean;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

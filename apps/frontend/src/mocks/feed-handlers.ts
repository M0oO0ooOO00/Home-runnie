import { http, HttpResponse } from 'msw';
import { Team } from '@homerunnie/shared';
import type { CreateFeedPostRequest, GetFeedPostsResponse } from '@/apis/feed/feed';
import type { FeedPost } from '@/shared/ui/feed-card/feed-card.types';
import { FEED_MOCK_POSTS } from './data/feed-mock-data';

const runtimePosts: FeedPost[] = [];

function getAllPosts(): FeedPost[] {
  return [...runtimePosts, ...FEED_MOCK_POSTS];
}

function encodeCursor(id: number): string {
  return btoa(String(id));
}

function decodeCursor(cursor: string): number | null {
  try {
    const id = parseInt(atob(cursor), 10);
    return Number.isFinite(id) ? id : null;
  } catch {
    return null;
  }
}

export const feedHandlers = [
  http.get('*/api/post/feed', async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const url = new URL(request.url);
    const cursor = url.searchParams.get('cursor');
    const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '20', 10), 50);

    const allPosts = getAllPosts();

    let startIdx = 0;
    if (cursor) {
      const cursorId = decodeCursor(cursor);
      if (cursorId !== null) {
        const idx = allPosts.findIndex((p) => p.id === cursorId);
        startIdx = idx >= 0 ? idx + 1 : 0;
      }
    }

    const items = allPosts.slice(startIdx, startIdx + limit);
    const lastItem = items[items.length - 1];
    const hasMore = startIdx + limit < allPosts.length;
    const nextCursor = hasMore && lastItem ? encodeCursor(lastItem.id) : null;

    const response: GetFeedPostsResponse = { items, nextCursor };
    return HttpResponse.json(response);
  }),

  http.post('*/api/post/feed', async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const body = (await request.json()) as CreateFeedPostRequest;

    if (!body.content || body.content.trim().length === 0) {
      return HttpResponse.json({ message: '본문은 필수입니다.' }, { status: 400 });
    }
    if (body.content.length > 2000) {
      return HttpResponse.json({ message: '본문은 2000자 이하여야 합니다.' }, { status: 400 });
    }
    if (body.images && body.images.length > 4) {
      return HttpResponse.json({ message: '이미지는 최대 4장입니다.' }, { status: 400 });
    }

    const newPost: FeedPost = {
      id: Date.now(),
      author: {
        type: 'member',
        id: 9999,
        nickname: '나',
        supportTeam: Team.DOOSAN,
      },
      content: body.content,
      images: body.images ?? [],
      likeCount: 0,
      isLiked: false,
      commentCount: 0,
      createdAt: new Date().toISOString(),
    };

    runtimePosts.unshift(newPost);
    return HttpResponse.json(newPost, { status: 201 });
  }),

  http.get('*/api/post/feed/:id', async ({ params }) => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return HttpResponse.json({ message: '잘못된 ID 형식입니다.' }, { status: 400 });
    }

    const post = getAllPosts().find((p) => p.id === id);
    if (!post) {
      return HttpResponse.json({ message: '해당 게시글을 찾을 수 없습니다.' }, { status: 404 });
    }

    return HttpResponse.json(post);
  }),
];

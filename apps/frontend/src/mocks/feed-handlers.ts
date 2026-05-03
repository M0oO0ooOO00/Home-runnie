import { http, HttpResponse } from 'msw';
import type { GetFeedPostsResponse } from '@/apis/feed/feed';
import { FEED_MOCK_POSTS } from './data/feed-mock-data';

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

    let startIdx = 0;
    if (cursor) {
      const cursorId = decodeCursor(cursor);
      if (cursorId !== null) {
        const idx = FEED_MOCK_POSTS.findIndex((p) => p.id === cursorId);
        startIdx = idx >= 0 ? idx + 1 : 0;
      }
    }

    const items = FEED_MOCK_POSTS.slice(startIdx, startIdx + limit);
    const lastItem = items[items.length - 1];
    const hasMore = startIdx + limit < FEED_MOCK_POSTS.length;
    const nextCursor = hasMore && lastItem ? encodeCursor(lastItem.id) : null;

    const response: GetFeedPostsResponse = { items, nextCursor };
    return HttpResponse.json(response);
  }),

  http.get('*/api/post/feed/:id', async ({ params }) => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return HttpResponse.json({ message: '잘못된 ID 형식입니다.' }, { status: 400 });
    }

    const post = FEED_MOCK_POSTS.find((p) => p.id === id);
    if (!post) {
      return HttpResponse.json({ message: '해당 게시글을 찾을 수 없습니다.' }, { status: 404 });
    }

    return HttpResponse.json(post);
  }),
];

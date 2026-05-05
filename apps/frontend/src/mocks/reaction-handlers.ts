import { http, HttpResponse } from 'msw';
import type { ToggleLikeResponse } from '@/apis/reaction/reaction';
import { FEED_MOCK_POSTS } from './data/feed-mock-data';

const likedTargets = new Map<string, boolean>();
const likeCountAdjust = new Map<string, number>();

function key(targetType: string, targetId: number) {
  return `${targetType}:${targetId}`;
}

export const reactionHandlers = [
  http.post('*/api/reaction/like/:targetType/:targetId', async ({ params }) => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const targetType = String(params.targetType);
    const targetId = Number(params.targetId);

    if (targetType !== 'POST') {
      return HttpResponse.json({ message: '현재는 POST 타입만 지원합니다.' }, { status: 400 });
    }

    if (!Number.isFinite(targetId)) {
      return HttpResponse.json({ message: '잘못된 ID' }, { status: 400 });
    }

    const post = FEED_MOCK_POSTS.find((p) => p.id === targetId);
    const exists = post || targetId > 0;
    if (!exists) {
      return HttpResponse.json({ message: '대상 없음' }, { status: 404 });
    }

    const k = key(targetType, targetId);
    const baseLiked = post?.isLiked ?? false;
    const baseCount = post?.likeCount ?? 0;

    const wasLiked = likedTargets.has(k) ? likedTargets.get(k)! : baseLiked;
    const newLiked = !wasLiked;
    likedTargets.set(k, newLiked);

    const adjust = (likeCountAdjust.get(k) ?? 0) + (newLiked ? 1 : -1);
    likeCountAdjust.set(k, adjust);

    const response: ToggleLikeResponse = {
      liked: newLiked,
      likeCount: Math.max(0, baseCount + adjust),
    };

    return HttpResponse.json(response);
  }),
];

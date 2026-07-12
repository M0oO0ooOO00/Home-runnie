import { http, HttpResponse } from 'msw';
import { Team } from '@homerunnie/shared';
import type { CreateFeedCommentRequest, FeedComment } from '@/apis/feed/comment';

const commentsByPostId = new Map<number, FeedComment[]>();
let nextCommentId = 1_000_000;

function flattenForLookup(list: FeedComment[]): FeedComment[] {
  const out: FeedComment[] = [];
  for (const c of list) {
    out.push(c);
    out.push(...flattenForLookup(c.replies));
  }
  return out;
}

function removeCommentById(list: FeedComment[], commentId: number): boolean {
  const index = list.findIndex((comment) => comment.id === commentId);
  if (index >= 0) {
    list.splice(index, 1);
    return true;
  }

  return list.some((comment) => removeCommentById(comment.replies, commentId));
}

export const commentHandlers = [
  http.get('*/api/post/feed/:postId/comments', async ({ params }) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const postId = Number(params.postId);
    if (!Number.isFinite(postId)) {
      return HttpResponse.json({ message: '잘못된 ID' }, { status: 400 });
    }
    const list = commentsByPostId.get(postId) ?? [];
    return HttpResponse.json(list);
  }),

  http.post('*/api/post/feed/:postId/comments', async ({ params, request }) => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const postId = Number(params.postId);
    const body = (await request.json()) as CreateFeedCommentRequest;
    const content = body.content?.trim() ?? '';
    const imageUrl = body.imageUrl?.trim() || null;

    if (!content && !imageUrl) {
      return HttpResponse.json({ message: '본문 또는 이미지는 필수입니다.' }, { status: 400 });
    }
    if (content.length > 1000) {
      return HttpResponse.json({ message: '댓글은 1000자 이하여야 합니다.' }, { status: 400 });
    }

    const list = commentsByPostId.get(postId) ?? [];

    const newComment: FeedComment = {
      id: nextCommentId++,
      author: {
        type: 'member',
        id: 9999,
        nickname: '나',
        supportTeam: Team.DOOSAN,
      },
      content,
      imageUrl,
      parentId: body.parentId ?? null,
      replies: [],
      createdAt: new Date().toISOString(),
    };

    if (body.parentId !== undefined && body.parentId !== null) {
      const parent = flattenForLookup(list).find((c) => c.id === body.parentId);
      if (!parent) {
        return HttpResponse.json({ message: '부모 댓글을 찾을 수 없습니다.' }, { status: 404 });
      }
      parent.replies.push(newComment);
    } else {
      list.push(newComment);
    }

    commentsByPostId.set(postId, list);
    return HttpResponse.json(newComment, { status: 201 });
  }),

  http.delete('*/api/post/feed/:postId/comments/:commentId', async ({ params }) => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const postId = Number(params.postId);
    const commentId = Number(params.commentId);

    const list = commentsByPostId.get(postId);
    if (!list) {
      return HttpResponse.json({ message: '댓글 없음' }, { status: 404 });
    }

    const all = flattenForLookup(list);
    const target = all.find((c) => c.id === commentId);
    if (!target) {
      return HttpResponse.json({ message: '댓글 없음' }, { status: 404 });
    }

    removeCommentById(list, commentId);

    commentsByPostId.set(postId, list);
    return HttpResponse.json({ id: commentId });
  }),
];

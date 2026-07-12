'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { MessageCircle, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { TeamDescription } from '@homerunnie/shared';
import { TeamProfileAvatar } from '@/shared/ui/profile/team-profile-avatar';
import { cn } from '@/lib/utils';
import { formatCompactCount, formatRelativeTime } from '@/lib/format';
import type { FeedComment } from '@/apis/feed/comment';
import { CommentInput } from './CommentInput';
import { useCommentInteraction } from './CommentInteractionContext';
import type { CommentItemActions } from './comment.types';

interface CommentItemProps {
  comment: FeedComment;
  isReply?: boolean;
  actions: CommentItemActions;
}

export function CommentItem({ comment, isReply = false, actions }: CommentItemProps) {
  const { viewerMemberId, replyingTo, isCreatingReply, isUpdatingComment } =
    useCommentInteraction();
  const isMine = viewerMemberId !== null && comment.author.id === viewerMemberId;
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const showMenu = isMine;
  const isReplyingTarget = replyingTo === comment.id;
  const likeCount = comment.likeCount ?? 0;

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  const handleReplyClick = () => {
    actions.toggleReply(comment.id);
  };

  const handleMenuDeleteClick = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    actions.delete(comment.id);
    setConfirmDelete(false);
    setMenuOpen(false);
  };

  return (
    <article className={cn('flex flex-col', isReply ? 'ml-[88px] gap-4 max-sm:ml-8' : 'gap-6')}>
      <div className="flex items-start gap-4">
        <TeamProfileAvatar
          supportTeam={comment.author.supportTeam}
          className={cn('shrink-0', isReply ? 'size-12' : 'size-14')}
        />
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <span className="truncate text-b01-sb text-gray-850">{comment.author.nickname}</span>
            {comment.author.supportTeam && (
              <span className="shrink-0 text-b01-r text-gray-500">
                {TeamDescription[comment.author.supportTeam] ?? comment.author.supportTeam}
              </span>
            )}
            <time className="basis-full text-b01-r text-gray-500" dateTime={comment.createdAt}>
              {formatRelativeTime(comment.createdAt)}
            </time>
          </div>
          {isEditing ? (
            <div className="mt-3">
              <CommentInput
                initialValue={comment.content}
                initialImageUrl={comment.imageUrl}
                placeholder="댓글을 입력하세요"
                isSubmitting={isUpdatingComment}
                submitLabel="저장"
                submittingLabel="저장 중"
                onSubmit={(value) => {
                  actions.update(comment.id, value);
                  setIsEditing(false);
                }}
                onCancel={() => setIsEditing(false)}
                autoFocus
                allowImage
              />
            </div>
          ) : (
            <div className="mt-8 flex flex-col gap-3 max-sm:mt-5">
              {comment.content && (
                <p className="whitespace-pre-wrap text-b01-r text-gray-950 max-sm:text-b02-r">
                  {comment.content}
                </p>
              )}
              {comment.imageUrl && (
                <div className="relative aspect-square w-full max-w-[220px] overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={comment.imageUrl}
                    alt="댓글 첨부 이미지"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          )}
          {!isEditing && (
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-b01-r text-gray-400">
              <button
                type="button"
                onClick={() => actions.like(comment.id)}
                className="inline-flex items-center gap-3 transition-colors hover:text-gray-700"
                aria-label={comment.isLiked ? '댓글 좋아요 취소' : '댓글 좋아요'}
              >
                <Image
                  src={comment.isLiked ? '/icons/like_click.svg' : '/icons/like_default.svg'}
                  alt=""
                  width={28}
                  height={28}
                  aria-hidden
                />
                <span>{formatCompactCount(likeCount)}</span>
              </button>
              {!isReply ? (
                <button
                  type="button"
                  onClick={handleReplyClick}
                  className="inline-flex items-center gap-3 transition-colors hover:text-gray-700"
                  aria-label="답글"
                >
                  <MessageCircle size={28} strokeWidth={1.8} />
                  <span>{formatCompactCount(comment.replies.length)}</span>
                </button>
              ) : (
                <span className="inline-flex items-center gap-3">
                  <MessageCircle size={28} strokeWidth={1.8} />
                  <span>{formatCompactCount(0)}</span>
                </span>
              )}
            </div>
          )}
        </div>

        {showMenu && (
          <div ref={menuRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="-m-2 rounded-full p-2 text-gray-400 transition-colors hover:text-gray-600"
              aria-label="댓글 더보기"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <MoreHorizontal size={28} strokeWidth={2.6} />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full z-10 mt-4 min-w-[150px] overflow-hidden rounded-xl bg-card shadow-02"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsEditing(true);
                    setMenuOpen(false);
                  }}
                  className="inline-flex w-full items-center gap-3 px-4 py-3 text-b03-m text-gray-700 transition-colors hover:bg-gray-100"
                >
                  <Pencil size={18} strokeWidth={1.8} />
                  <span>수정하기</span>
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleMenuDeleteClick}
                  className={cn(
                    'inline-flex w-full items-center gap-3 px-4 py-3 text-b03-m transition-colors hover:bg-red-50',
                    confirmDelete ? 'text-red-600' : 'text-red-500',
                  )}
                >
                  <Trash2 size={18} strokeWidth={1.8} />
                  <span>{confirmDelete ? '한번 더 클릭' : '삭제하기'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {isReplyingTarget && (
        <div className="ml-[72px]">
          <CommentInput
            placeholder={`${comment.author.nickname}에게 답글 달기`}
            isSubmitting={isCreatingReply(comment.id)}
            onSubmit={(content) => actions.submitReply(comment.id, content)}
            onCancel={() => actions.toggleReply(comment.id)}
            autoFocus
            allowImage
          />
        </div>
      )}

      {comment.replies.length > 0 && (
        <div className="flex flex-col gap-10">
          <button
            type="button"
            onClick={() => setShowReplies((prev) => !prev)}
            className="ml-[88px] self-start text-b01-r text-gray-500 transition-colors hover:text-gray-800 max-sm:ml-8"
            aria-expanded={showReplies}
          >
            {showReplies ? '답글 숨기기' : `답글 더 보기 (${comment.replies.length})`}
          </button>
          {showReplies &&
            comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply actions={actions} />
            ))}
        </div>
      )}
    </article>
  );
}

'use client';

import { useState } from 'react';
import { MessageSquare, Trash2 } from 'lucide-react';
import { TeamDescription } from '@homerunnie/shared';
import { TeamProfileAvatar } from '@/shared/ui/profile/team-profile-avatar';
import { cn } from '@/lib/utils';
import type { FeedComment } from '@/apis/feed/comment';
import { CommentInput } from './CommentInput';

function formatRelativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
  return new Date(iso).toLocaleDateString('ko-KR');
}

interface CommentItemProps {
  comment: FeedComment;
  viewerMemberId: number | null;
  isReply?: boolean;
  isReplyingTarget?: boolean;
  isCreatingReply?: boolean;
  onReplyToggle?: (commentId: number) => void;
  onReplySubmit?: (parentId: number, content: string) => void;
  onDelete?: (commentId: number) => void;
  onAuthRequired?: () => void;
}

export function CommentItem({
  comment,
  viewerMemberId,
  isReply = false,
  isReplyingTarget = false,
  isCreatingReply = false,
  onReplyToggle,
  onReplySubmit,
  onDelete,
  onAuthRequired,
}: CommentItemProps) {
  const isMine = viewerMemberId !== null && comment.author.id === viewerMemberId;
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleReplyClick = () => {
    if (viewerMemberId === null) {
      onAuthRequired?.();
      return;
    }
    onReplyToggle?.(comment.id);
  };

  const handleDeleteClick = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    onDelete?.(comment.id);
    setConfirmDelete(false);
  };

  return (
    <div className={cn('flex flex-col gap-2', isReply && 'ml-10')}>
      <div className="flex items-start gap-3">
        <TeamProfileAvatar supportTeam={comment.author.supportTeam} size={32} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-c01-m text-gray-950 truncate">{comment.author.nickname}</span>
            {comment.author.supportTeam && (
              <span className="text-c01-r text-gray-500 shrink-0">
                · {TeamDescription[comment.author.supportTeam] ?? comment.author.supportTeam}
              </span>
            )}
          </div>
          <p className="text-b03-r text-gray-800 whitespace-pre-wrap mt-0.5">{comment.content}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <time className="text-c01-r text-gray-400" dateTime={comment.createdAt}>
              {formatRelativeTime(comment.createdAt)}
            </time>
            {!isReply && onReplyToggle && (
              <button
                type="button"
                onClick={handleReplyClick}
                className="inline-flex items-center gap-1 text-c01-r text-gray-500 hover:text-gray-700 transition-colors"
              >
                <MessageSquare size={12} />
                <span>답글</span>
              </button>
            )}
            {isMine && onDelete && (
              <button
                type="button"
                onClick={handleDeleteClick}
                className={cn(
                  'inline-flex items-center gap-1 text-c01-r transition-colors',
                  confirmDelete ? 'text-red-600 font-semibold' : 'text-gray-500 hover:text-red-500',
                )}
              >
                <Trash2 size={12} />
                <span>{confirmDelete ? '한번 더 클릭' : '삭제'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {isReplyingTarget && onReplySubmit && (
        <div className="ml-10">
          <CommentInput
            placeholder={`@${comment.author.nickname}에게 답글 달기`}
            isSubmitting={isCreatingReply}
            onSubmit={(content) => onReplySubmit(comment.id, content)}
            onCancel={() => onReplyToggle?.(comment.id)}
            autoFocus
          />
        </div>
      )}

      {comment.replies.length > 0 && (
        <div className="flex flex-col gap-3 mt-1">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              viewerMemberId={viewerMemberId}
              isReply
              onDelete={onDelete}
              onAuthRequired={onAuthRequired}
            />
          ))}
        </div>
      )}
    </div>
  );
}

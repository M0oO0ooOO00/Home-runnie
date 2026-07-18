'use client';

import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import { TeamDescription } from '@homerunnie/shared';
import { TeamProfileAvatar } from '@/shared/ui/profile/team-profile-avatar';
import { cn } from '@/lib/utils';
import { formatCompactCount, formatRelativeTime } from '@/lib/format';
import type { FeedPost } from './feed-card.types';
import { FeedCardImageGrid } from './FeedCardImageGrid';
import { FeedCardKebabMenu } from './FeedCardKebabMenu';

export interface FeedCardProps {
  post: FeedPost;
  priorityImage?: boolean;
  viewerMemberId?: number | null;
  onLikeClick?: (post: FeedPost) => void;
  onCommentClick?: (post: FeedPost) => void;
  onCardClick?: (post: FeedPost) => void;
  onEditClick?: (post: FeedPost) => void;
  onDeleteClick?: (post: FeedPost) => void;
  expanded?: boolean;
  className?: string;
}

export function FeedCard({
  post,
  priorityImage = false,
  viewerMemberId,
  onLikeClick,
  onCommentClick,
  onCardClick,
  onEditClick,
  onDeleteClick,
  expanded = false,
  className,
}: FeedCardProps) {
  const { author, content, images, likeCount, isLiked, commentCount, createdAt, updatedAt } = post;
  const isMine =
    viewerMemberId !== undefined && viewerMemberId !== null && author.id === viewerMemberId;
  const showKebab = isMine && (onEditClick || onDeleteClick);
  const isEdited = updatedAt && updatedAt !== createdAt;

  return (
    <article
      className={cn(
        'h-fit w-full max-w-[585px] overflow-hidden rounded-[28px] bg-card px-5 py-6 shadow-02 sm:px-6 sm:py-7',
        onCardClick && 'cursor-pointer',
        className,
      )}
      onClick={() => onCardClick?.(post)}
    >
      <header className="flex items-start gap-3.5 sm:gap-4">
        <TeamProfileAvatar supportTeam={author.supportTeam} className="size-14 shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col pt-0.5">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="truncate text-b01-sb text-gray-850">{author.nickname}</span>
            {author.supportTeam && (
              <span className="shrink-0 text-b02-m text-gray-600">
                {TeamDescription[author.supportTeam] ?? author.supportTeam}
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <time className="text-b02-r text-gray-600" dateTime={createdAt}>
              {formatRelativeTime(createdAt, 'compact')}
            </time>
            {isEdited && <span className="text-b02-r text-gray-600">· 수정됨</span>}
          </div>
        </div>
        {showKebab && (
          <FeedCardKebabMenu
            onEdit={onEditClick ? () => onEditClick(post) : undefined}
            onDelete={onDeleteClick ? () => onDeleteClick(post) : undefined}
          />
        )}
      </header>

      <div className="py-7 sm:py-8">
        <p
          className={cn(
            'whitespace-pre-wrap text-b01-r text-gray-950',
            !expanded && 'line-clamp-6',
          )}
        >
          {content}
        </p>
      </div>

      {images.length > 0 && (
        <div className="-mt-1 pb-7 sm:pb-8">
          <FeedCardImageGrid images={images} showAll={expanded} priority={priorityImage} />
        </div>
      )}

      <footer className="flex items-center gap-8 text-gray-600">
        <button
          type="button"
          onClick={(e) => {
            if (!onLikeClick) return;
            e.stopPropagation();
            onLikeClick(post);
          }}
          className={cn(
            'inline-flex items-center gap-2 text-b01-m transition-colors',
            isLiked ? 'text-red-500' : 'text-gray-600',
            onLikeClick ? 'cursor-pointer' : 'pointer-events-none',
            onLikeClick && !isLiked && 'hover:text-red-500',
          )}
          aria-label={isLiked ? '좋아요 취소' : '좋아요'}
        >
          <Image
            src={isLiked ? '/icons/like_click.svg' : '/icons/like_default.svg'}
            alt=""
            width={28}
            height={28}
            aria-hidden
          />
          <span>{formatCompactCount(likeCount)}</span>
        </button>
        <button
          type="button"
          onClick={(e) => {
            if (!onCommentClick) return;
            e.stopPropagation();
            onCommentClick(post);
          }}
          className={cn(
            'inline-flex items-center gap-2 text-b01-m text-gray-600 transition-colors',
            onCommentClick ? 'cursor-pointer' : 'pointer-events-none',
            onCommentClick && 'hover:text-gray-700',
          )}
          aria-label="댓글"
        >
          <MessageCircle size={28} strokeWidth={1.8} />
          <span>{formatCompactCount(commentCount)}</span>
        </button>
      </footer>
    </article>
  );
}

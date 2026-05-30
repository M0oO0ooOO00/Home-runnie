'use client';

import { Heart, MessageCircle } from 'lucide-react';
import { TeamDescription } from '@homerunnie/shared';
import { TeamProfileAvatar } from '@/shared/ui/profile/team-profile-avatar';
import { cn } from '@/lib/utils';
import type { FeedPost } from './feed-card.types';
import { FeedCardKebabMenu } from './FeedCardKebabMenu';

function formatRelativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return '방금전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간전`;
  return new Date(iso).toLocaleDateString('ko-KR');
}

function formatCompactCount(count: number): string {
  if (count >= 1_000_000) return `${Number((count / 1_000_000).toFixed(1))}m`;
  if (count >= 1_000) return `${Number((count / 1_000).toFixed(1))}k`;
  return String(count);
}

function ImageGrid({ images }: { images: string[] }) {
  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="overflow-hidden rounded-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[0]} alt="" className="w-full max-h-[520px] object-cover" />
      </div>
    );
  }

  if (images.length === 2) {
    return (
      <div className="grid aspect-[2/1] grid-cols-2 gap-1.5 overflow-hidden rounded-xl">
        {images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={`${src}-${i}`} src={src} alt="" className="h-full w-full object-cover" />
        ))}
      </div>
    );
  }

  const overflowCount = images.length - 3;

  return (
    <div className="grid aspect-[3/2] grid-cols-2 grid-rows-2 gap-1.5 overflow-hidden rounded-xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={images[0]} alt="" className="row-span-2 h-full w-full object-cover" />
      {images.slice(1, 3).map((src, i) => (
        <div key={`${src}-${i}`} className="relative h-full w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="h-full w-full object-cover" />
          {i === 1 && overflowCount > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-t04-b text-white">
              +{overflowCount}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export interface FeedCardProps {
  post: FeedPost;
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
              <span className="shrink-0 text-b02-m text-gray-500">
                {TeamDescription[author.supportTeam] ?? author.supportTeam}
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <time className="text-b02-r text-gray-500" dateTime={createdAt}>
              {formatRelativeTime(createdAt)}
            </time>
            {isEdited && <span className="text-b02-r text-gray-500">· 수정됨</span>}
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
          <ImageGrid images={images} />
        </div>
      )}

      <footer className="flex items-center gap-8 text-gray-400">
        <button
          type="button"
          onClick={(e) => {
            if (!onLikeClick) return;
            e.stopPropagation();
            onLikeClick(post);
          }}
          className={cn(
            'inline-flex items-center gap-2 text-b01-m transition-colors',
            isLiked ? 'text-red-500' : 'text-gray-400',
            onLikeClick ? 'cursor-pointer' : 'pointer-events-none',
            onLikeClick && !isLiked && 'hover:text-red-500',
          )}
          aria-label={isLiked ? '좋아요 취소' : '좋아요'}
        >
          <Heart size={28} strokeWidth={1.8} fill={isLiked ? 'currentColor' : 'none'} />
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
            'inline-flex items-center gap-2 text-b01-m text-gray-400 transition-colors',
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

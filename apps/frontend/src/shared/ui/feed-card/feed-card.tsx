'use client';

import { Heart, MessageCircle } from 'lucide-react';
import { TeamDescription } from '@homerunnie/shared';
import { TeamProfileAvatar } from '@/shared/ui/profile/team-profile-avatar';
import { cn } from '@/lib/utils';
import type { FeedPost } from './feed-card.types';

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

function ImageGrid({ images }: { images: string[] }) {
  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="overflow-hidden rounded-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[0]} alt="" className="w-full max-h-[480px] object-cover" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-1 overflow-hidden rounded-lg">
      {images.slice(0, 4).map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={i} src={src} alt="" className="aspect-square w-full object-cover" />
      ))}
    </div>
  );
}

export interface FeedCardProps {
  post: FeedPost;
  onLikeClick?: (post: FeedPost) => void;
  onCommentClick?: (post: FeedPost) => void;
  onCardClick?: (post: FeedPost) => void;
  expanded?: boolean;
  className?: string;
}

export function FeedCard({
  post,
  onLikeClick,
  onCommentClick,
  onCardClick,
  expanded = false,
  className,
}: FeedCardProps) {
  const { author, content, images, likeCount, isLiked, commentCount, createdAt } = post;

  return (
    <article
      className={cn(
        'w-full bg-background rounded-2xl border border-gray-100 overflow-hidden',
        onCardClick && 'cursor-pointer hover:bg-gray-50/50 transition-colors',
        className,
      )}
      onClick={() => onCardClick?.(post)}
    >
      <header className="flex items-start gap-3 px-4 pt-4">
        <TeamProfileAvatar supportTeam={author.supportTeam} size={40} />
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-b02-sb text-gray-950 truncate">{author.nickname}</span>
            {author.supportTeam && (
              <span className="text-c01-m text-gray-500 shrink-0">
                · {TeamDescription[author.supportTeam] ?? author.supportTeam}
              </span>
            )}
          </div>
          <time className="text-c01-r text-gray-400" dateTime={createdAt}>
            {formatRelativeTime(createdAt)}
          </time>
        </div>
      </header>

      <div className="px-4 py-3">
        <p
          className={cn(
            'text-b03-r text-gray-800 whitespace-pre-wrap',
            !expanded && 'line-clamp-6',
          )}
        >
          {content}
        </p>
      </div>

      {images.length > 0 && (
        <div className="px-4 pb-3">
          <ImageGrid images={images} />
        </div>
      )}

      <footer className="flex items-center gap-4 px-4 pb-4 pt-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onLikeClick?.(post);
          }}
          className={cn(
            'inline-flex items-center gap-1.5 text-c01-m transition-colors',
            isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500',
          )}
          aria-label={isLiked ? '좋아요 취소' : '좋아요'}
        >
          <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
          <span>{likeCount}</span>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCommentClick?.(post);
          }}
          className="inline-flex items-center gap-1.5 text-c01-m text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="댓글"
        >
          <MessageCircle size={18} />
          <span>{commentCount}</span>
        </button>
      </footer>
    </article>
  );
}

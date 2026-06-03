import { Team, TeamDescription } from '@homerunnie/shared';

export const formatKoreanDate = (date: Date): string => {
  return date
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\./g, '/')
    .replace(/\s/g, '');
};

export const formatKoreanTime = (date: Date): string => {
  return date.toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatKoreanFullDate = (date: Date): string => {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
};

export const isSameDay = (a: Date, b: Date): boolean => {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

export const formatTeamName = (team: string | null): string => {
  if (!team) return '-';
  return TeamDescription[team as Team] ?? team;
};

export const formatCompactCount = (count: number): string => {
  if (count >= 1_000_000) return `${Number((count / 1_000_000).toFixed(1))}m`;
  if (count >= 1_000) return `${Number((count / 1_000).toFixed(1))}k`;
  return String(count);
};

export const formatRelativeTime = (iso: string, spacing: 'compact' | 'spaced' = 'spaced') => {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = Math.floor((now - then) / 1000);
  const space = spacing === 'spaced' ? ' ' : '';

  if (diff < 60) return spacing === 'spaced' ? '방금 전' : '방금전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분${space}전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간${space}전`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}일${space}전`;
  return new Date(iso).toLocaleDateString('ko-KR');
};

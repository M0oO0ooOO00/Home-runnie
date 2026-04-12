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

export const formatTeamName = (team: string | null): string => {
  if (!team) return '-';
  return TeamDescription[team as Team] ?? team;
};

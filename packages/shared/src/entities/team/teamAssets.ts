import { Team } from './team';

export const DEFAULT_PROFILE_IMAGE = '/images/default.png';

/* 추후 이미지 수정 필요!! */
export const TEAM_ASSETS: Partial<Record<Team, { image: string }>> = {
  [Team.DOOSAN]: { image: '/images/default.png' },
  [Team.HANWHA]: { image: '/images/orange.png' },
  [Team.KIWOOM]: { image: '/images/red.png' },
  [Team.KIA]: { image: '/images/red.png' },
  [Team.KT]: { image: '/images/default.png' },
  [Team.LG]: { image: '/images/pink.png' },
  [Team.LOTTE]: { image: '/images/default.png' },
  [Team.NC]: { image: '/images/default.png' },
  [Team.SAMSUNG]: { image: '/images/blue.png' },
  [Team.SSG]: { image: '/images/red.png' },
};

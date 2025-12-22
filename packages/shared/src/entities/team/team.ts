export enum Team {
  DOOSAN = 'DOOSAN',
  HANWHA = 'HANWHA',
  KIWOOM = 'KIWOOM',
  KIA = 'KIA',
  KT = 'KT',
  LG = 'LG',
  LOTTE = 'LOTTE',
  NC = 'NC',
  SAMSUNG = 'SAMSUNG',
  SSG = 'SSG',
}

export const TeamDescription: Record<Team, string> = {
  [Team.DOOSAN]: '두산 베어스',
  [Team.KT]: 'KT 위즈',
  [Team.LOTTE]: '롯데 자이언츠',
  [Team.SAMSUNG]: '삼성 라이온즈',
  [Team.NC]: 'NC 다이노스',
  [Team.KIA]: 'KIA 타이거즈',
  [Team.HANWHA]: '한화 이글스',
  [Team.KIWOOM]: '키움 히어로즈',
  [Team.SSG]: 'SSG 랜더스',
  [Team.LG]: 'LG 트윈스',
};

const teamDisplayOrder: readonly Team[] = [
  Team.DOOSAN,
  Team.KT,
  Team.LOTTE,
  Team.SAMSUNG,
  Team.NC,
  Team.KIA,
  Team.HANWHA,
  Team.KIWOOM,
  Team.SSG,
  Team.LG,
];

export const baseBallTeamItems = teamDisplayOrder.map((team) => ({
  value: team,
  label: TeamDescription[team],
}));

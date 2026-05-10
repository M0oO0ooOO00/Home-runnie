import { Team } from '@homerunnie/shared';
import type { FeedPost } from '@/shared/ui/feed-card/feed-card.types';

export const FEED_MOCK_TEAMS: (Team | null)[] = [
  Team.DOOSAN,
  Team.LG,
  Team.HANWHA,
  Team.KIA,
  Team.SAMSUNG,
  Team.NC,
  Team.LOTTE,
  Team.SSG,
  Team.KIWOOM,
  Team.KT,
  null,
];

export const FEED_MOCK_NICKNAMES = [
  '직관러',
  '응원단장',
  '치킨한입',
  '맥주한잔',
  '잠실고정',
  '대구사람',
  '광주출신',
  '인천토박이',
  '잠실3루',
  '응원가왕',
  '야구덕후',
  '경기장러버',
];

export const FEED_MOCK_CONTENTS = [
  '오늘 직관 갔는데 진짜 분위기 미쳤다 🔥\n9회말 역전 홈런이라니... 살면서 본 경기 중 최고였음',
  '직관 메이트 구합니다! 다음주 토요일 잠실, 같이 갈 분 댓글 주세요 ㅎㅎ',
  '치킨 vs 핫도그 영원한 떡밥... 여러분은 뭐 드시나요?',
  '응원가 외우는 꿀팁 공유합니다.\n1. 유튜브에서 응원가 30분 들으면서 출퇴근\n2. 가사보다 후렴구 박수 타이밍 먼저 익히기\n3. 치어리더 따라하기',
  '오늘 우리팀 왜 이래... 답답해 죽겠다 ㅠㅠ',
  '첫 직관이었는데 너무 떨려서 응원도 제대로 못했어요. 다음엔 친구랑 같이 가야지',
  '잠실역 6번 출구 → 잠실종합운동장 가는 가장 빠른 길 공유합니다.\n지하 통로 이용하면 비 와도 안 젖고 좋아요',
  '7회 응원 시간이 진짜 클라이맥스인 것 같다. 다같이 떼창하는 그 순간',
  '직관 가서 사진 찍는 분들 많은데, 1루 측 vs 3루 측 어디가 더 잘 나오나요?',
  '오늘 경기 중계 안 보고 직관만 갔는데 놓친 거 알려주실 분',
  '주차 미쳤다 진짜... 1시간 30분 걸렸어요. 다음엔 무조건 대중교통',
  '응원봉 처음 사봤는데 정말 분위기에 몰입되네요 ㅎㅎ 추천합니다',
  '비 와서 우천취소될 줄 알았는데 다행히 진행됐다. 우비 입고 직관도 또 다른 매력',
  '구장 음식 추천해주세요! 잠실 기준 뭐가 맛있나요?',
  '오늘 우리편 선발 정말 좋았는데 불펜에서... 마음이 아프다',
  '응원가 가사 모를 때 그냥 박수만 쳐도 분위기 따라가지나요? 첫 직관 앞두고 걱정 ㅠㅠ',
  '8회까지 6:0으로 이기다가 9회에 뒤집어진 거 본 적 있는 분?',
  '직관러 모임 만들고 싶은데 사람들 관심 있으실까요? 정모는 한 달에 1~2번',
  '경기장 좌석 추천!\n3루 익사이팅 zone 가성비 최고. 응원 분위기도 좋고 시야도 괜찮아요',
];

export function generateMockFeedPost(id: number): FeedPost {
  const team = FEED_MOCK_TEAMS[id % FEED_MOCK_TEAMS.length];
  const imageCount = id % 5;
  const images =
    imageCount === 0
      ? []
      : Array.from(
          { length: imageCount },
          (_, i) => `https://picsum.photos/seed/feed-${id}-${i}/800/600`,
        );

  const minutesAgo = id * 13;

  return {
    id,
    author: {
      type: 'member',
      id: 1000 + id,
      nickname: `${FEED_MOCK_NICKNAMES[id % FEED_MOCK_NICKNAMES.length]}${id}`,
      supportTeam: team,
    },
    content: FEED_MOCK_CONTENTS[id % FEED_MOCK_CONTENTS.length],
    images,
    likeCount: (id * 7) % 200,
    isLiked: id % 3 === 0,
    commentCount: (id * 3) % 30,
    createdAt: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
  };
}

export const FEED_MOCK_TOTAL = 100;

export const FEED_MOCK_POSTS: FeedPost[] = Array.from({ length: FEED_MOCK_TOTAL }, (_, i) =>
  generateMockFeedPost(FEED_MOCK_TOTAL - i),
);

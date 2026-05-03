import type { Meta, StoryObj, Decorator } from '@storybook/react';
import { Team } from '@homerunnie/shared';
import { FeedCard } from '@/shared/ui/feed-card/feed-card';
import type { FeedPost } from '@/shared/ui/feed-card/feed-card.types';

const Wrapper: Decorator = (Story) => (
  <div className="font-sans bg-gray-50 min-h-screen p-6">
    <div className="max-w-[600px] mx-auto">
      <Story />
    </div>
  </div>
);

const basePost: FeedPost = {
  id: 1,
  author: {
    type: 'member',
    id: 1,
    nickname: '직관러123',
    supportTeam: Team.DOOSAN,
  },
  content: '오늘 잠실에서 두산 5:3 LG 승리! 🎉 9회말 역전 홈런 진짜 미쳤다.',
  images: [],
  likeCount: 24,
  isLiked: false,
  commentCount: 5,
  createdAt: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
};

const meta = {
  title: 'UI/Feed/FeedCard',
  component: FeedCard,
  decorators: [Wrapper],
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    post: basePost,
    onLikeClick: (p: FeedPost) => console.log('like:', p.id),
    onCommentClick: (p: FeedPost) => console.log('comment:', p.id),
    onCardClick: (p: FeedPost) => console.log('card:', p.id),
  },
} satisfies Meta<typeof FeedCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextOnly: Story = {};

export const OneImage: Story = {
  args: {
    post: {
      ...basePost,
      id: 2,
      images: ['https://picsum.photos/seed/feed-2/800/600'],
    },
  },
};

export const TwoImages: Story = {
  args: {
    post: {
      ...basePost,
      id: 3,
      images: [
        'https://picsum.photos/seed/feed-3a/600/600',
        'https://picsum.photos/seed/feed-3b/600/600',
      ],
    },
  },
};

export const ThreeImages: Story = {
  args: {
    post: {
      ...basePost,
      id: 4,
      images: [
        'https://picsum.photos/seed/feed-4a/600/600',
        'https://picsum.photos/seed/feed-4b/600/600',
        'https://picsum.photos/seed/feed-4c/600/600',
      ],
    },
  },
};

export const FourImages: Story = {
  args: {
    post: {
      ...basePost,
      id: 5,
      images: [
        'https://picsum.photos/seed/feed-5a/600/600',
        'https://picsum.photos/seed/feed-5b/600/600',
        'https://picsum.photos/seed/feed-5c/600/600',
        'https://picsum.photos/seed/feed-5d/600/600',
      ],
    },
  },
};

export const LongContent: Story = {
  args: {
    post: {
      ...basePost,
      id: 6,
      content: `오늘 처음으로 직관 갔는데 진짜 너무 재밌었어요!
경기 시작 전부터 응원가 따라 부르면서 분위기 익히고 있었는데
주변 팬분들이 정말 친절하게 응원법도 알려주시고 같이 흔들흔들 해주셨어요.

7회 응원 시간엔 진짜 분위기가 미쳤음. 다같이 떼창하는데 소름 돋더라.
앞으로 자주 갈 것 같아요. 다음엔 친구도 같이 데려갈 예정 ㅎㅎ
혹시 같이 가실 분 있으면 댓글 주세요! 평일 저녁 위주로 가능해요.`,
      likeCount: 142,
      commentCount: 23,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
  },
};

export const Liked: Story = {
  args: {
    post: {
      ...basePost,
      id: 7,
      isLiked: true,
      likeCount: 25,
    },
  },
};

export const NoSupportTeam: Story = {
  args: {
    post: {
      ...basePost,
      id: 8,
      author: {
        ...basePost.author,
        nickname: '응원팀미정',
        supportTeam: null,
      },
    },
  },
};

export const FeedList: Story = {
  render: () => (
    <div className="space-y-3">
      <FeedCard post={basePost} />
      <FeedCard
        post={{
          ...basePost,
          id: 10,
          author: { ...basePost.author, nickname: '한화팬', supportTeam: Team.HANWHA },
          content: '오늘 한화 폼 미쳤다',
          images: ['https://picsum.photos/seed/list-10/800/500'],
          likeCount: 88,
          isLiked: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        }}
      />
      <FeedCard
        post={{
          ...basePost,
          id: 11,
          author: { ...basePost.author, nickname: 'LG트윈스러버', supportTeam: Team.LG },
          content: '잠실에서 직관 메이트 구합니다 (이번주 토요일)',
          images: [],
          likeCount: 3,
          commentCount: 12,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        }}
      />
    </div>
  ),
};

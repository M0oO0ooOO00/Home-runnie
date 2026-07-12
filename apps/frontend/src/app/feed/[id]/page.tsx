import type { Metadata } from 'next';
import { TeamDescription } from '@homerunnie/shared';
import FeedDetailPageClient from './FeedDetailPageClient';
import { absoluteUrl, buildSeoDescription, fetchFeedPostForSeo } from '@/lib/seo-api';

interface FeedDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: FeedDetailPageProps): Promise<Metadata> {
  const postId = Number(params.id);
  const post = await fetchFeedPostForSeo(postId);
  const canonical = absoluteUrl(`/feed/${params.id}`);

  if (!post) {
    return {
      title: '커뮤니티 게시글 | 홈러니(Homerunnie)',
      alternates: {
        canonical,
      },
    };
  }

  const team = post.author.supportTeam
    ? (TeamDescription[post.author.supportTeam] ?? post.author.supportTeam)
    : '야구 팬';
  const title = `${post.author.nickname}님의 ${team} 이야기`;
  const description = buildSeoDescription(post.content, '홈러니 야구 팬 커뮤니티 게시글입니다.');

  return {
    title: `${title} | 홈러니(Homerunnie)`,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${title} | 홈러니(Homerunnie)`,
      description,
      url: canonical,
      type: 'article',
      images: post.images.slice(0, 1),
    },
  };
}

export default async function FeedDetailPage({ params }: FeedDetailPageProps) {
  const initialPost = await fetchFeedPostForSeo(Number(params.id));

  return <FeedDetailPageClient params={params} initialPost={initialPost} />;
}

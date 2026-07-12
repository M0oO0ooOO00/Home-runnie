import type { Metadata } from 'next';
import FeedPageClient from './FeedPageClient';
import { absoluteUrl, fetchFeedPostsForSeo } from '@/lib/seo-api';

export const metadata: Metadata = {
  title: '야구 팬 커뮤니티 | 홈러니(Homerunnie)',
  description: '홈러니 커뮤니티에서 야구 직관 후기와 응원 이야기를 확인해보세요.',
  alternates: {
    canonical: absoluteUrl('/feed'),
  },
};

export default async function FeedPage() {
  const initialData = await fetchFeedPostsForSeo(10);

  return <FeedPageClient initialData={initialData} />;
}

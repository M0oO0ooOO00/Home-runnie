import type { Metadata } from 'next';
import MainBanner from './components/MainBanner';
import MateListBanner from './components/MateListBanner';
import { absoluteUrl, fetchRecruitmentPostsForSeo } from '@/lib/seo-api';

export const metadata: Metadata = {
  title: '홈러니(Homerunnie) | 직관 메이트 찾기',
  description: '홈러니에서 야구 직관 메이트 모집글을 확인하고 함께 응원할 팬을 찾아보세요.',
  alternates: {
    canonical: absoluteUrl('/home'),
  },
};

export default async function Page() {
  const initialRecruitments = await fetchRecruitmentPostsForSeo({ page: 1, pageSize: 5 });

  return (
    <div className="w-full flex flex-col">
      <MainBanner />
      <MateListBanner initialData={initialRecruitments} />
    </div>
  );
}

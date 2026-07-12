import type { Metadata } from 'next';
import RecruitmentListClient from './RecruitmentListClient';
import { absoluteUrl, fetchRecruitmentPostsForSeo } from '@/lib/seo-api';

export const metadata: Metadata = {
  title: '직관 메이트 모집글 | 홈러니(Homerunnie)',
  description: '야구 경기 일정, 구장, 응원팀에 맞는 직관 메이트 모집글을 찾아보세요.',
  alternates: {
    canonical: absoluteUrl('/home/list'),
  },
};

export default async function RecruitmentListPage() {
  const initialData = await fetchRecruitmentPostsForSeo({ page: 1, pageSize: 6 });

  return <RecruitmentListClient initialData={initialData} />;
}

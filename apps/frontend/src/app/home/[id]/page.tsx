import type { Metadata } from 'next';
import { Team, TeamDescription, baseBallStadiumItems } from '@homerunnie/shared';
import RecruitmentPostDetailClient from './RecruitmentPostDetailClient';
import { absoluteUrl, buildSeoDescription, fetchRecruitmentPostDetailForSeo } from '@/lib/seo-api';

interface RecruitmentPostDetailPageProps {
  params: { id: string };
}

const STADIUM_LABEL_MAP = new Map(baseBallStadiumItems.map((item) => [item.value, item.label]));

const teamLabel = (team: string | null | undefined) =>
  team ? (TeamDescription[team as Team] ?? team) : '';

export async function generateMetadata({
  params,
}: RecruitmentPostDetailPageProps): Promise<Metadata> {
  const postId = Number(params.id);
  const post = await fetchRecruitmentPostDetailForSeo(postId);
  const canonical = absoluteUrl(`/home/${params.id}`);

  if (!post) {
    return {
      title: '직관 메이트 모집글 | 홈러니(Homerunnie)',
      alternates: {
        canonical,
      },
    };
  }

  const teams = [teamLabel(post.teamHome), teamLabel(post.teamAway)].filter(Boolean).join(' vs ');
  const stadium = STADIUM_LABEL_MAP.get(
    post.stadium as (typeof baseBallStadiumItems)[number]['value'],
  );
  const fallback = `${teams} ${stadium ? `${stadium} ` : ''}경기 직관 메이트 모집글입니다.`;
  const description = buildSeoDescription(post.message, fallback);

  return {
    title: `${post.title} | 홈러니(Homerunnie)`,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${post.title} | 홈러니(Homerunnie)`,
      description,
      url: canonical,
      type: 'article',
    },
  };
}

export default async function RecruitmentPostDetailPage({
  params,
}: RecruitmentPostDetailPageProps) {
  const initialPost = await fetchRecruitmentPostDetailForSeo(Number(params.id));

  return <RecruitmentPostDetailClient initialPost={initialPost} />;
}

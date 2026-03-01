'use client';

import { useParams, useRouter } from 'next/navigation';
import { useRecruitmentPostDetailQuery } from '@/hooks/post/usePostQuery';

export default function RecruitmentPostDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const postId = Number(params.id);
  const { data, isLoading, isError } = useRecruitmentPostDetailQuery(postId);

  if (isLoading) {
    return <div className="py-20 text-center text-gray-500">상세 정보를 불러오는 중...</div>;
  }

  if (isError || !data) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-600 mb-4">모집글을 찾을 수 없습니다.</p>
        <button
          type="button"
          onClick={() => router.push('/home')}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          홈으로 이동
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-10 md:px-[120px]">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 text-b03-r text-gray-500 hover:text-gray-800"
      >
        ← 뒤로가기
      </button>

      <div className="rounded-2xl border border-gray-200 bg-white p-8">
        <h1 className="text-t02-sb mb-6">{data.title}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-b02-r">
          <p>
            <span className="text-gray-500">경기:</span> {data.teamHome} vs {data.teamAway}
          </p>
          <p>
            <span className="text-gray-500">경기장:</span> {data.stadium}
          </p>
          <p>
            <span className="text-gray-500">경기 날짜:</span>{' '}
            {new Date(data.gameDate).toLocaleDateString('ko-KR')}
          </p>
          <p>
            <span className="text-gray-500">모집 인원:</span> {data.currentParticipants}/
            {data.recruitmentLimit}
          </p>
          <p>
            <span className="text-gray-500">선호 성별:</span> {data.preferGender}
          </p>
          <p>
            <span className="text-gray-500">티켓:</span> {data.ticketingType ?? '-'}
          </p>
        </div>

        <div className="mt-8">
          <p className="text-b03-sb text-gray-700 mb-2">하고 싶은 말</p>
          <p className="text-b02-r text-gray-600 whitespace-pre-wrap">{data.message || '-'}</p>
        </div>
      </div>
    </div>
  );
}

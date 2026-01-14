import { PagePaginationResponse, RecruitmentSummaryResponse } from '@homerunnie/shared';

export const getWrittenRecruitments = async (
  pageNum: number,
): Promise<PagePaginationResponse<RecruitmentSummaryResponse[]>> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030';
  const response = await fetch(`${apiUrl}/member/my/written-recruitments?page=${pageNum}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('내가 작성한 모집글 조회에 실패했습니다.');
  }

  return response.json();
};

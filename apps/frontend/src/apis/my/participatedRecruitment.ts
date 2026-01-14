import { PagePaginationResponse, RecruitmentSummaryResponse } from '@homerunnie/shared';

export const getParticipatedRecruitments = async (
  pageNum: number,
): Promise<PagePaginationResponse<RecruitmentSummaryResponse[]>> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030';
  const response = await fetch(`${apiUrl}/member/my/participated-recruitments?page=${pageNum}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('내가 참여한 모집글 조회에 실패했습니다.');
  }

  return response.json();
};

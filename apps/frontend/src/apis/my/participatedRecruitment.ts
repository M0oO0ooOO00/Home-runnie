import { PagePaginationResponse, RecruitmentSummaryResponse } from '@homerunnie/shared';

import { apiClient } from '@/lib/fetchClient';

export const getParticipatedRecruitments = async (
  pageNum: number,
): Promise<PagePaginationResponse<RecruitmentSummaryResponse[]>> => {
  return apiClient.get(`/member/my/participated-recruitments?page=${pageNum}`);
};

import { PagePaginationResponse, RecruitmentSummaryResponse } from '@homerunnie/shared';

import { apiClient } from '@/lib/fetchClient';

export const getScrappedRecruitments = async (
  pageNum: number,
): Promise<PagePaginationResponse<RecruitmentSummaryResponse[]>> => {
  return apiClient.get(`/member/my/scrapped-recruitments?page=${pageNum}`);
};

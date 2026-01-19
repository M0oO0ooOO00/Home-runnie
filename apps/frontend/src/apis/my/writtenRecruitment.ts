import { PagePaginationResponse, RecruitmentSummaryResponse } from '@homerunnie/shared';

import { apiClient } from '@/lib/fetchClient';

export const getWrittenRecruitments = async (
  pageNum: number,
): Promise<PagePaginationResponse<RecruitmentSummaryResponse[]>> => {
  return apiClient.get(`/member/my/written-recruitments?page=${pageNum}`);
};

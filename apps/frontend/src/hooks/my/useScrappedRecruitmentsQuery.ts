'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getScrappedRecruitments } from '@/apis/my/scrappedRecruitment';
import { PagePaginationResponse, RecruitmentSummaryResponse } from '@homerunnie/shared';

export const useScrappedRecruitmentsQuery = (
  pageNum: number,
  options?: Omit<
    UseQueryOptions<PagePaginationResponse<RecruitmentSummaryResponse[]>, Error>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: ['scrapped-recruitments', pageNum],
    queryFn: () => getScrappedRecruitments(pageNum),
    ...options,
  });
};

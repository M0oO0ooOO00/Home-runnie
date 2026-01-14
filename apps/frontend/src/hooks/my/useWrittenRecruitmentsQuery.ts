'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getWrittenRecruitments } from '@/apis/my/writtenRecruitment';
import { PagePaginationResponse, RecruitmentSummaryResponse } from '@homerunnie/shared';

export const useWrittenRecruitmentsQuery = (
  pageNum: number,
  options?: Omit<
    UseQueryOptions<PagePaginationResponse<RecruitmentSummaryResponse[]>, Error>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: ['written-recruitments', pageNum],
    queryFn: () => getWrittenRecruitments(pageNum),
    ...options,
  });
};

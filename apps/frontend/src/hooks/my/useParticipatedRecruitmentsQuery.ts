'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getParticipatedRecruitments } from '@/apis/my/participatedRecruitment';
import { PagePaginationResponse, RecruitmentSummaryResponse } from '@homerunnie/shared';

export const useParticipatedRecruitmentsQuery = (
  pageNum: number,
  options?: Omit<
    UseQueryOptions<PagePaginationResponse<RecruitmentSummaryResponse[]>, Error>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: ['participated-recruitments', pageNum],
    queryFn: () => getParticipatedRecruitments(pageNum),
    ...options,
  });
};

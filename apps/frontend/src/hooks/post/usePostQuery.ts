'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getRecruitmentComments,
  getRecruitmentPostDetail,
  getRecruitmentPosts,
  type GetRecruitmentPostDetailResponse,
  type GetRecruitmentPostsResponse,
  type GetRecruitmentPostsQueryParams,
} from '@/apis/post/post';

export const useRecruitmentPostsQuery = (
  params: GetRecruitmentPostsQueryParams = {},
  initialData?: GetRecruitmentPostsResponse | null,
) => {
  return useQuery({
    queryKey: ['recruitment-posts', params],
    queryFn: () => getRecruitmentPosts(params),
    initialData: initialData ?? undefined,
    retry: false,
  });
};

export const useRecruitmentPostDetailQuery = (
  postId: number,
  initialData?: GetRecruitmentPostDetailResponse | null,
) => {
  return useQuery({
    queryKey: ['recruitment-post-detail', postId],
    queryFn: () => getRecruitmentPostDetail(postId),
    enabled: Number.isFinite(postId) && postId > 0,
    initialData: initialData ?? undefined,
  });
};

export const useRecruitmentCommentsQuery = (postId: number) => {
  return useQuery({
    queryKey: ['recruitment-comments', postId],
    queryFn: () => getRecruitmentComments(postId),
    enabled: Number.isFinite(postId) && postId > 0,
  });
};

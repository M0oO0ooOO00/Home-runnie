'use client';

import { useQuery } from '@tanstack/react-query';
import { getRecruitmentPostDetail, getRecruitmentPosts } from '@/apis/post/post';

export const useRecruitmentPostsQuery = (page: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: ['recruitment-posts', page, pageSize],
    queryFn: () => getRecruitmentPosts(page, pageSize),
  });
};

export const useRecruitmentPostDetailQuery = (postId: number) => {
  return useQuery({
    queryKey: ['recruitment-post-detail', postId],
    queryFn: () => getRecruitmentPostDetail(postId),
    enabled: Number.isFinite(postId) && postId > 0,
  });
};

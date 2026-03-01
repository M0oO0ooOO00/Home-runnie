'use client';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { CreateRecruitmentPostRequest, CreateRecruitmentPostResponse } from '@homerunnie/shared';
import { createRecruitmentPost } from '@/apis/post/post';

export const useCreateRecruitmentPostMutation = (
  options?: UseMutationOptions<CreateRecruitmentPostResponse, Error, CreateRecruitmentPostRequest>,
) => {
  return useMutation({
    mutationFn: createRecruitmentPost,
    ...options,
  });
};

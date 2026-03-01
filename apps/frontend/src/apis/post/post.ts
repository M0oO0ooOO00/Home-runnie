import { CreateRecruitmentPostRequest, CreateRecruitmentPostResponse } from '@homerunnie/shared';
import { apiClient } from '@/lib/fetchClient';

export const createRecruitmentPost = async (
  data: CreateRecruitmentPostRequest,
): Promise<CreateRecruitmentPostResponse> => {
  return apiClient.post<CreateRecruitmentPostResponse>('/post/recruitment', data, {
    authRequired: true,
  });
};

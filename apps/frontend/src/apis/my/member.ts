import { GetMyProfileResponse } from '@homerunnie/shared';

import { apiClient } from '@/lib/fetchClient';

export const getMyProfile = async (): Promise<GetMyProfileResponse> => {
  return apiClient.get('/member/my');
};

export const getMyProfileProtected = async (): Promise<GetMyProfileResponse> => {
  return apiClient.get('/member/my', { authRequired: true });
};

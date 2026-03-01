import { GetMyProfileResponse } from '@homerunnie/shared';

import { apiClient } from '@/lib/fetchClient';

export const getMyProfile = async (options?: {
  authRequired?: boolean;
}): Promise<GetMyProfileResponse> => {
  return apiClient.get('/member/my', { authRequired: options?.authRequired ?? false });
};

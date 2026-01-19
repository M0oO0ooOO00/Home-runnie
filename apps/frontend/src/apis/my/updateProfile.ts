import { GetMyProfileResponse, UpdateMyProfileRequest } from '@homerunnie/shared';

import { apiClient } from '@/lib/fetchClient';

export const updateProfile = async (
  updateMyProfileRequest: UpdateMyProfileRequest,
): Promise<GetMyProfileResponse> => {
  return apiClient.put('/member/my', updateMyProfileRequest);
};

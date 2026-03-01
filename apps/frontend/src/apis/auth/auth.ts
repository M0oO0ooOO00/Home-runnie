import { SignupCompleteRequest } from '@homerunnie/shared';

import { apiClient } from '@/lib/fetchClient';

export const completeSignUp = async (data: SignupCompleteRequest) => {
  return apiClient.post('/auth/signup', data);
};

export const logout = async () => {
  return apiClient.post('/auth/logout');
};

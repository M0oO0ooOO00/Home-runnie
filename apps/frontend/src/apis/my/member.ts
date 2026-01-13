import { GetMyProfileResponse } from '@homerunnie/shared';

export const getMyProfile = async (): Promise<GetMyProfileResponse> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030';

  const response = await fetch(`${apiUrl}/member/my`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch my profile');
  }

  return response.json();
};

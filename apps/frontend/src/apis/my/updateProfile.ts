import { UpdateMyProfileRequest } from '@homerunnie/shared';

export const updateProfile = async (updateMyProfileRequest: UpdateMyProfileRequest) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030';
  const response = await fetch(`${apiUrl}/member/my`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(updateMyProfileRequest),
  });

  if (!response.ok) {
    throw new Error('프로필 정보 변경에 실패했습니다.');
  }

  return response.json();
};

import { SignupCompleteRequest } from '@homerunnie/shared';

export const completeSignUp = async (data: SignupCompleteRequest) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030';

  const response = await fetch(`${apiUrl}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '회원가입에 실패했습니다.');
  }

  return response.json();
};

import { SignupCompleteRequest } from '@homerunnie/shared';

export const completeSignUp = async (data: SignupCompleteRequest) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030';

  const response = await fetch(`${apiUrl}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Signup failed');
  }

  return response;
};

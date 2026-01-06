export const useKakaoLogin = () => {
  const handleKakaoLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030';
    window.location.href = `${apiUrl}/auth/kakao`;
  };

  return { handleKakaoLogin };
};

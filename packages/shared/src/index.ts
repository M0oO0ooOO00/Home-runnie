// 공유 유틸리티 함수 예시
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 타입 정의 예시
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 상수 예시
export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  USERS: '/api/users',
} as const;


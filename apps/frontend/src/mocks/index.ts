// MSW 활성화 여부를 환경 변수로 제어
export const isMockEnabled = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

// 브라우저 환경에서만 MSW 초기화
if (typeof window !== 'undefined' && isMockEnabled) {
  import('./browser').then(({ worker }) => {
    worker.start({
      onUnhandledRequest: 'bypass', // 목업 핸들러가 없는 요청은 실제 서버로 전달
    });
  });
}

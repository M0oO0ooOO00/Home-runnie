import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// 서버 환경(SSR, 테스트)에서 MSW를 설정합니다
export const server = setupServer(...handlers);

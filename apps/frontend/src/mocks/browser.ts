import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// 브라우저 환경에서 MSW를 설정합니다
export const worker = setupWorker(...handlers);

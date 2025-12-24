import baseConfig from '../jest.config.base.js';

export default {
  ...baseConfig, // 공통 설정 재사용
  testEnvironment: 'jsdom', // Frontend만의 설정
  rootDir: '.',
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

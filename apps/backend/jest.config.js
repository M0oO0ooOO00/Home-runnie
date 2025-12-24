import baseConfig from '../../jest.config.base.js';

export default {
  ...baseConfig, // 공통 설정 재사용
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  coverageDirectory: '../coverage',
  testEnvironment: 'node', // Backend만의 설정
};

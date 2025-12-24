export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s?(x)', '!**/*.(spec|test).[jt]s?(x)', '!**/node_modules/**'],
};

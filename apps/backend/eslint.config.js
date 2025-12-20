import { baseConfig } from "@homerunnie/eslint-config/base.js";

export default [
  ...baseConfig,
  {
    // NestJS 전용 추가 설정
    env: { node: true },
    rules: {
      "@typescript-eslint/interface-name-prefix": "off",
    },
  },
];


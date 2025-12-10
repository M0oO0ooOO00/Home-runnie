import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: [
    "../src/**/storybook/**/*.stories.@(js|jsx|ts|tsx)",
    "../src/**/**/*.stories.@(js|jsx|ts|tsx)",
    "../src/**/*.mdx",
  ],
  addons: ["@storybook/addon-links", "@storybook/addon-a11y", "@storybook/addon-docs"],
  framework: { name: "@storybook/nextjs", options: {} }, // Vite는 nextjs 프레임워크가 알아서 씀
  staticDirs: ["../public"], // 상대경로만 쓰면 OK
};
export default config;

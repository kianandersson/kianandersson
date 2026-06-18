import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/preact-vite';

const config: StorybookConfig = {
  stories: [
    '../src/foundations/**/*.stories.@(ts|tsx)',
    '../src/components/**/*.stories.@(ts|tsx)',
  ],
  addons: ['@storybook/addon-a11y', '@storybook/addon-vitest', '@storybook/addon-docs'],
  staticDirs: ['../public'],
  framework: {
    name: '@storybook/preact-vite',
    options: {},
  },
  async viteFinal(viteConfig) {
    viteConfig.resolve ??= {};
    viteConfig.resolve.alias = {
      ...(viteConfig.resolve.alias ?? {}),
      'astro:actions': fileURLToPath(new URL('./astro-actions-stub.ts', import.meta.url)),
    };
    return viteConfig;
  },
};

export default config;

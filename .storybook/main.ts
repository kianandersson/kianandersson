import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/preact-vite';

const config: StorybookConfig = {
  stories: [
    '../src/foundations/**/*.stories.@(ts|tsx)',
    '../src/components/**/*.stories.@(ts|tsx)',
    '../src/artifacts/**/*.stories.@(ts|tsx)',
  ],
  addons: ['@storybook/addon-a11y', '@storybook/addon-vitest'],
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
    // Storybook's Vite root is the project root, so Vite's default `publicDir`
    // also resolves to `./public` — the same tree `staticDirs` already copies.
    // Both copies run concurrently during `storybook build` and race to create
    // `<out>/fonts`, throwing `EEXIST: mkdir`. Let `staticDirs` own the copy.
    viteConfig.publicDir = false;
    return viteConfig;
  },
};

export default config;

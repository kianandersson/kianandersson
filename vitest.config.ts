import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'preact',
  },
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime',
    },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          setupFiles: ['./vitest.setup.ts'],
          css: true,
          include: ['src/**/*.test.{ts,tsx}'],
        },
      },
      {
        extends: true,
        plugins: [storybookTest({ configDir: `${dirname}.storybook` })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
          coverage: {
            provider: 'v8',
            // Only count what the stories actually drive: Preact components
            // under src/components. Foundations, lib/, and pages/ are
            // tested elsewhere or are documentation surfaces.
            include: ['src/components/**/*.{ts,tsx}'],
            exclude: ['**/*.stories.tsx', '**/index.ts'],
            reporter: ['text', 'html'],
            reportsDirectory: './coverage/storybook',
          },
        },
      },
    ],
  },
});

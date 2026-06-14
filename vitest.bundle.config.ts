import { defineConfig } from 'vitest/config';

// Separate config for tests that need a built `dist/` to run. Kept out
// of the default `pnpm test` glob so unit tests stay fast and don't
// require a build.
export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
  },
});

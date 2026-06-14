import { defineConfig } from 'vitest/config';

// Separate from the default `pnpm test` glob so unit tests stay
// fast and don't require a build.
export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
  },
});

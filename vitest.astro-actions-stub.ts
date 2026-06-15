// Test-time stub for the `astro:actions` virtual module. Vitest doesn't run
// the Astro build pipeline, so we alias the import here and let individual
// tests `vi.mock('astro:actions', …)` to control behaviour.
import { vi } from 'vitest';

export const actions = {
  contact: {
    send: vi.fn(),
  },
};

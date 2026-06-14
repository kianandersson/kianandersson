// Lighthouse CI config. Same assertions either way — only the target
// switches: local `pnpm lhci` serves `dist/` as a static site, while CI
// sets `PREVIEW_URL` to audit the live deployed preview instead.
const target = process.env.PREVIEW_URL
  ? { url: [process.env.PREVIEW_URL] }
  : { staticDistDir: './dist' };

module.exports = {
  ci: {
    collect: {
      ...target,
      numberOfRuns: 3,
      settings: { preset: 'desktop' },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 1 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 1 }],
        'categories:seo': ['error', { minScore: 1 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 1000 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};

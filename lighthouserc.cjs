// Lighthouse CI config. Target switches based on `PREVIEW_URL`:
// - unset → static-serve `dist/` (local + the PR's lighthouse-local job)
// - set   → audit the live deployed URL (release's post-deploy audit)
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

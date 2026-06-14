// Lighthouse config for the hosted preview deploy. Mirrors the local
// `lighthouserc.json` assertions but targets the live URL from
// `PREVIEW_URL` (set by the deploy-preview job after `wrangler versions
// upload`).
module.exports = {
  ci: {
    collect: {
      url: [process.env.PREVIEW_URL],
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

// Lighthouse config for the hosted preview deploy, targeting the
// live URL from `PREVIEW_URL` (set by the deploy job after
// `wrangler versions upload`).
//
// SEO is deliberately not enforced here: the preview lives on a
// non-canonical workers.dev host, and the page's canonical/sitemap
// reference the production domain — Lighthouse correctly penalises
// that, but it's noise on a preview. Strict SEO belongs in a future
// Lighthouse pass against the production URL.
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
        'largest-contentful-paint': ['error', { maxNumericValue: 1000 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};

// Lighthouse CI config. Target switches based on `PREVIEW_URL`:
// - unset → static-serve `dist/` (local + the lighthouse-local CI job)
// - set   → audit the live deployed preview URL
//
// SEO is only asserted against the static target. Cloudflare adds
// `X-Robots-Tag: noindex` to every workers.dev response to prevent
// preview indexing, which sinks Lighthouse's is-crawlable audit — so
// SEO regressions are caught locally instead.
const hosted = !!process.env.PREVIEW_URL;
const target = hosted ? { url: [process.env.PREVIEW_URL] } : { staticDistDir: './dist' };

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
        ...(hosted ? {} : { 'categories:seo': ['error', { minScore: 1 }] }),
        'largest-contentful-paint': ['error', { maxNumericValue: 1000 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};

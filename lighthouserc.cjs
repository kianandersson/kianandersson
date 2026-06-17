const target = process.env.URL ? { url: [process.env.URL] } : { staticDistDir: './dist/client' };

module.exports = {
  ci: {
    collect: {
      ...target,
      numberOfRuns: 3,
      settings: { preset: 'desktop' },
    },
    assert: {
      assertMatrix: [
        {
          // Skip /og — render-only canvas for the OG image, intentionally noindex.
          // Skip /design/ — Storybook catalog, scored on its own terms (not as a
          // shipped page).
          matchingUrlPattern: '^(?!.*/og/)(?!.*/design/).*$',
          assertions: {
            'categories:performance': ['error', { minScore: 1 }],
            'categories:accessibility': ['error', { minScore: 1 }],
            'categories:best-practices': ['error', { minScore: 1 }],
            'categories:seo': ['error', { minScore: 1 }],
            'largest-contentful-paint': ['error', { maxNumericValue: 1000 }],
          },
        },
      ],
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};

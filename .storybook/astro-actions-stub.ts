// Storybook stub for the `astro:actions` virtual module. Storybook doesn't
// run the Astro build pipeline, so we alias the import here. Stories that
// exercise submit flows can either await the resolved value or override
// `actions.contact.send` from their render fn.
export const actions = {
  contact: {
    send: async (_payload: unknown) => ({ data: { ok: true }, error: undefined }),
  },
};

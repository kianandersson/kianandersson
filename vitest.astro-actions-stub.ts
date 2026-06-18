// Test stub for the `astro:actions` virtual module. The unit project
// aliases the import here so handler code (`src/actions/`) loads under
// vitest without spinning the Astro runtime up.
//
// `defineAction` returns the config object as-is — production callers
// invoke `server.contact.send(input)` and Astro's runtime wires the
// request context; the vitest suite imports the extracted handler
// function directly instead, so the wrapper doesn't need to behave
// like a real ActionClient.

export class ActionError extends Error {
  readonly code: string;
  constructor(opts: { code: string; message: string }) {
    super(opts.message);
    this.code = opts.code;
    this.name = 'ActionError';
  }
}

export function defineAction<T>(config: T): T {
  return config;
}

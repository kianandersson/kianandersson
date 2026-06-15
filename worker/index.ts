interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') {
        return new Response(null, { status: 405, headers: { allow: 'POST' } });
      }
      return new Response(null, { status: 202 });
    }

    return env.ASSETS.fetch(request);
  },
};

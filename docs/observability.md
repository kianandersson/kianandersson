# Observability

The site runs three signals end-to-end:

| Signal           | Source                              | Scope                                       |
| ---------------- | ----------------------------------- | ------------------------------------------- |
| Traces           | Cloudflare Workers Tracing          | Each request, handler, outbound fetch       |
| Logs             | Cloudflare Workers Logs             | Structured invocation logs                  |
| Core Web Vitals  | Cloudflare Web Analytics (RUM)      | LCP, INP, CLS, FCP, TTFB from real browsers |

The stack is intentionally lean: every signal comes from a Cloudflare-native source, costs nothing extra, and requires no application-side SDK or snippet. The goal is to demonstrate a production-shaped observability posture without paying for it in bundle size, vendor lock-in, or boilerplate.

## Server side — Workers Tracing + Logs

Both are toggled on in `wrangler.jsonc`:

```jsonc
"observability": {
  "enabled": true,
  "logs": { "enabled": true, "invocation_logs": true },
  "traces": { "enabled": true }
}
```

That's the entire integration. The Workers runtime auto-instruments handler invocations, binding calls, and outbound `fetch()` calls (including the Resend call inside the `contact` action) and emits OpenTelemetry-compatible spans. Traces and logs are queryable from the Cloudflare dashboard with shared trace IDs.

Custom spans are not yet GA in the native tracer. If we want per-action attributes (e.g. `contact.validation_failed`) before then, the migration path is to add `@microlabs/otel-cf-workers` and wrap the adapter's fetch handler. Not worth it at this site's scale.

## Client side — Cloudflare Web Analytics

Core Web Vitals are collected via Cloudflare's RUM beacon, which is **injected automatically** into HTML responses once Web Analytics is enabled for the site in the Cloudflare dashboard. There is no application snippet, no env var, and no opt-in token in this repo — the integration lives entirely on the edge.

The beacon is privacy-first by design: no cookies, no `localStorage`, no IP storage. That matches the rest of the site's posture and keeps us out of consent-banner territory.

We deliberately do **not** ship `@opentelemetry/sdk-trace-web` or a hand-rolled `web-vitals` beacon. Cloudflare's edge-injected beacon already covers the same metrics with a smaller payload and zero application code.

## OTLP export (optional)

Both traces and logs can be forwarded to any OTLP-compatible backend (Honeycomb, Grafana Cloud, Axiom, Sentry) by registering the destination in the Cloudflare dashboard and listing it under `observability.traces.destinations` / `observability.logs.destinations` in `wrangler.jsonc`. No code change is required.

This is left unconfigured by default — the native Cloudflare dashboard is more than enough for a single-page site. The hook is documented here so future-me knows the migration is one config block away.

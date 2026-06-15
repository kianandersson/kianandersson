/// <reference types="astro/client" />
/// <reference path="../worker-configuration.d.ts" />

declare namespace Cloudflare {
  interface Env {
    RESEND_API_KEY?: string;
    CONTACT_TO?: string;
  }
}

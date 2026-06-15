import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { env } from 'cloudflare:workers';
import { Resend } from 'resend';
import { siteConfig } from '../site.config';

const FROM_ADDRESS = 'Contact <noreply@kianandersson.dk>';

export const server = {
  contact: {
    send: defineAction({
      accept: 'json',
      input: z.object({
        email: z.email(),
        subject: z.string().trim().min(1).max(120),
        message: z.string().trim().min(1).max(5000),
      }),
      handler: async (input) => {
        const apiKey = env.RESEND_API_KEY;
        const to = env.CONTACT_TO ?? siteConfig.email;

        if (!apiKey) {
          // No RESEND_API_KEY in this environment — log the payload and accept.
          // Keeps `astro dev` self-contained without secrets.
          console.log('[contact] dev mode (no RESEND_API_KEY):', input);
          return { ok: true } as const;
        }

        const resend = new Resend(apiKey);
        const { error } = await resend.emails.send({
          from: FROM_ADDRESS,
          to,
          replyTo: input.email,
          subject: input.subject,
          text: input.message,
        });

        if (error) {
          throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message: "Couldn't send the message — please try again in a moment.",
          });
        }

        return { ok: true } as const;
      },
    }),
  },
};

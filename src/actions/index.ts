import { ActionError, defineAction } from 'astro:actions';
import { CONTACT_FROM, CONTACT_TO, RESEND_API_KEY } from 'astro:env/server';
import { Resend } from 'resend';
import { z } from 'zod';
import {
  CONTACT_EMAIL_REGEX,
  CONTACT_MESSAGE_MAX,
  CONTACT_SUBJECT_MAX,
} from '../lib/contact-validation';
import { siteConfig } from '../site.config';

export const server = {
  contact: {
    send: defineAction({
      accept: 'json',
      input: z.object({
        email: z.string().trim().regex(CONTACT_EMAIL_REGEX),
        subject: z.string().trim().min(1).max(CONTACT_SUBJECT_MAX),
        message: z.string().trim().min(1).max(CONTACT_MESSAGE_MAX),
      }),
      handler: async (input, context) => {
        if (!RESEND_API_KEY || !CONTACT_FROM || !CONTACT_TO) {
          throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message: "Couldn't send the message — please try again in a moment. !",
          });
        }

        const host = new URL(context.request.url).hostname;
        const name = siteConfig.name;

        const { error } = await new Resend(RESEND_API_KEY).emails.send({
          from: `${host} <${CONTACT_FROM}>`,
          to: `${name} <${CONTACT_TO}>`,
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

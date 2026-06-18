import { ActionError, defineAction } from 'astro:actions';
import { RECIPIENT_EMAIL, RESEND_API_KEY, SENDER_EMAIL } from 'astro:env/server';
import { Resend } from 'resend';
import { z } from 'zod';
import {
  CONTACT_EMAIL_REGEX,
  CONTACT_MESSAGE_MAX,
  CONTACT_SUBJECT_MAX,
} from '../lib/contact-validation';
import { siteConfig } from '../site.config';

const emailField = z.string().trim().regex(CONTACT_EMAIL_REGEX);

// Format-check the secrets at request time — `astro:env` only type-checks
// strings, so an invalid email here would otherwise surface as a generic
// Resend rejection deep in the handler.
const envSchema = z.object({
  RESEND_API_KEY: z.string().min(1),
  SENDER_EMAIL: emailField,
  RECIPIENT_EMAIL: emailField,
});

const SEND_FAILED_MESSAGE = "Couldn't send the message — please try again in a moment.";

export const sendContactMessage = defineAction({
  accept: 'json',
  input: z.object({
    email: emailField,
    subject: z.string().trim().min(1).max(CONTACT_SUBJECT_MAX),
    message: z.string().trim().min(1).max(CONTACT_MESSAGE_MAX),
  }),
  handler: async (input, context) => {
    try {
      const env = envSchema.parse({ RESEND_API_KEY, SENDER_EMAIL, RECIPIENT_EMAIL });
      const host = new URL(context.request.url).hostname;

      const { error } = await new Resend(env.RESEND_API_KEY).emails.send({
        from: `${host} <${env.SENDER_EMAIL}>`,
        to: `${siteConfig.fullName} <${env.RECIPIENT_EMAIL}>`,
        replyTo: input.email,
        subject: input.subject,
        text: input.message,
      });

      if (error) throw new Error(error.message);

      return { ok: true } as const;
    } catch (cause) {
      if (cause instanceof ActionError) throw cause;

      const error = cause instanceof Error ? cause : new Error(String(cause));

      console.error({ message: 'Failed to send contact message', error });

      throw new ActionError({
        code: 'INTERNAL_SERVER_ERROR',
        message: SEND_FAILED_MESSAGE,
      });
    }
  },
});

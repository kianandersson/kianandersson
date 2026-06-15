import { ActionError, defineAction } from "astro:actions";
import { CONTACT_FROM, CONTACT_TO, RESEND_API_KEY } from "astro:env/server";
import { Resend } from "resend";
import { z } from "zod";
import { siteConfig } from "../site.config";

export const server = {
  contact: {
    send: defineAction({
      accept: "json",
      input: z.object({
        email: z.email(),
        subject: z.string().trim().min(1).max(120),
        message: z.string().trim().min(1).max(5000),
      }),
      handler: async (input, context) => {
        if (!RESEND_API_KEY || !CONTACT_FROM || !CONTACT_TO) {
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              "Couldn't send the message — please try again in a moment. !",
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
            code: "INTERNAL_SERVER_ERROR",
            message:
              "Couldn't send the message — please try again in a moment.",
          });
        }

        return { ok: true } as const;
      },
    }),
  },
};

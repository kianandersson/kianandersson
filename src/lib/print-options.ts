import { z } from 'zod';

/**
 * Private contact details for the offline CV — email and phone only. These are
 * intentionally absent from the public site and injected at build time via the
 * `PRINT_OPTIONS` env (a JSON string) only when generating the PDF locally.
 * Everything else on the CV footer comes from the site config.
 */
const PrintOptionsSchema = z.object({
  email: z.email().optional(),
  phone: z.string().optional(),
});

export type PrintOptions = z.infer<typeof PrintOptionsSchema>;

/** Full set of details rendered in the CV contact footer. */
export type ContactDetails = PrintOptions & {
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
};

/**
 * Parses the `PRINT_OPTIONS` env into the private contact details.
 *
 * Returns `null` when nothing usable is provided (env unset, empty, or every
 * field blank) so the public build renders no contact block at all. Throws on
 * malformed input so a botched print run fails loudly rather than shipping an
 * empty CV.
 */
export function parsePrintOptions(raw: string | undefined): PrintOptions | null {
  if (!raw || raw.trim() === '') return null;

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch (cause) {
    throw new Error('PRINT_OPTIONS is not valid JSON', { cause });
  }

  const parsed = PrintOptionsSchema.parse(dropBlankFields(json));
  const hasValue = Object.values(parsed).some((value) => value !== undefined);
  return hasValue ? parsed : null;
}

/**
 * Drops blank string fields so empty placeholders (e.g. an unfilled `phone`
 * in the .env template) read as absent rather than failing validation.
 */
function dropBlankFields(value: unknown): unknown {
  if (typeof value !== 'object' || value === null) return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).filter(
      ([, v]) => !(typeof v === 'string' && v.trim() === ''),
    ),
  );
}

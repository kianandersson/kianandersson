import { z } from 'zod';

/**
 * Build-time options for the offline CV, injected via the `PRINT_OPTIONS` env
 * (a JSON string) only when generating the PDF locally — never on the public
 * build.
 *
 * - `email` / `phone`: private contact details, intentionally absent from the
 *   public site. Everything else on the CV footer comes from the site config.
 * - `minSkillLevel`: lowest skill level to keep in the "all skills" section.
 *   Omitted means every skill is included; set e.g. 3 to drop level 1–2 skills
 *   from the CV.
 * - `allStackSkills` / `allMethodSkills`: when true, each role's stack (resp.
 *   methods) skills print in full instead of truncating to the on-screen
 *   "+N more" preview. They are independent, so a CV can expand one list and
 *   truncate the other.
 */
const PrintOptionsSchema = z.object({
  email: z.email().optional(),
  phone: z.string().optional(),
  minSkillLevel: z.coerce.number().int().min(1).max(5).optional(),
  allStackSkills: z.boolean().optional(),
  allMethodSkills: z.boolean().optional(),
});

export type PrintOptions = z.infer<typeof PrintOptionsSchema>;

/** The private contact subset rendered in the CV footer. */
export type ContactOptions = Pick<PrintOptions, 'email' | 'phone'>;

/** Full set of details rendered in the CV contact footer. */
export type ContactDetails = ContactOptions & {
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
};

/**
 * Parses the `PRINT_OPTIONS` env into the print build options.
 *
 * Returns `null` when nothing usable is provided (env unset, empty, or every
 * field blank) so the public build renders no contact block and keeps every
 * skill. Throws on malformed input so a botched print run fails loudly rather
 * than shipping a broken CV.
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
 * in print.options.json) read as absent rather than failing validation.
 */
function dropBlankFields(value: unknown): unknown {
  if (typeof value !== 'object' || value === null) return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).filter(
      ([, v]) => !(typeof v === 'string' && v.trim() === ''),
    ),
  );
}

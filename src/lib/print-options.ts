import { z } from 'zod';

/**
 * Build-time print options, injected via `PRINT_OPTIONS` (JSON) only for the
 * local PDF — never the public build.
 *
 * - `email` / `phone`: private contact details (the rest comes from site config).
 * - `minSkillLevel`: drop skills below this level from "all skills" (default: all).
 * - `allStackSkills` / `allDomainSkills`: print a role's full stack/domains list
 *   instead of the "+N more" preview.
 * - `profilePhoto`: include the hero profile photo on the CV (default: true; set
 *   `false` to leave it off).
 */
const PrintOptionsSchema = z.object({
  email: z.email().optional(),
  phone: z.string().optional(),
  minSkillLevel: z.coerce.number().int().min(1).max(5).optional(),
  allStackSkills: z.boolean().optional(),
  allDomainSkills: z.boolean().optional(),
  profilePhoto: z.boolean().optional(),
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
 * Parses `PRINT_OPTIONS` into the print options, or `null` when nothing usable
 * is provided. Throws on malformed input so a botched run fails loudly.
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

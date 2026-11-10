export const LOCALES = ['en', 'da'] as const;

export type Locale = (typeof LOCALES)[number];

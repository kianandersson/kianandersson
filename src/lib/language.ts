export const LANGUAGE_NAMES = ['Danish', 'English'] as const;

export const LANGUAGE_LEVELS = [
  'Native',
  'Fluent',
  'Professional',
  'Conversational',
  'Basic',
] as const;

export type LanguageName = (typeof LANGUAGE_NAMES)[number];
export type LanguageLevel = (typeof LANGUAGE_LEVELS)[number];

export type Language = {
  name: LanguageName;
  level: LanguageLevel;
};

import type { Locale } from './locale';

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

const DANISH_NAMES: Record<LanguageName, string> = {
  Danish: 'Dansk',
  English: 'Engelsk',
};

const DANISH_LEVELS: Record<LanguageLevel, string> = {
  Native: 'Modersmål',
  Fluent: 'Flydende',
  Professional: 'Professionelt niveau',
  Conversational: 'Samtaleniveau',
  Basic: 'Grundlæggende',
};

export function languageNameLabel(name: LanguageName, locale: Locale = 'en'): string {
  return locale === 'da' ? DANISH_NAMES[name] : name;
}

export function languageLevelLabel(level: LanguageLevel, locale: Locale = 'en'): string {
  return locale === 'da' ? DANISH_LEVELS[level] : level;
}

import type { Locale } from './locale';

const UNITS: Record<Locale, { one: string; other: string }> = {
  en: { one: 'yr', other: 'yrs' },
  da: { one: 'år', other: 'år' },
};

export function formatYears(years: number, locale: Locale = 'en'): string {
  const { one, other } = UNITS[locale];
  if (years === 0) return `<1 ${other}`;
  return `+${years} ${years === 1 ? one : other}`;
}

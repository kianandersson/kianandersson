import type { Locale } from './locale';

const MONTHS: Record<Locale, readonly string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  da: [
    'jan.',
    'feb.',
    'mar.',
    'apr.',
    'maj',
    'jun.',
    'jul.',
    'aug.',
    'sep.',
    'okt.',
    'nov.',
    'dec.',
  ],
};

const PRESENT: Record<Locale, string> = {
  en: 'Present',
  da: 'nu',
};

// Danish typography sets ranges with an en dash; English keeps the em dash.
const SEPARATOR: Record<Locale, string> = {
  en: ' — ',
  da: ' – ',
};

function monthYear(date: Date, locale: Locale): string {
  return `${MONTHS[locale][date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export function formatPeriod(start: Date, end?: Date, locale: Locale = 'en'): string {
  return `${monthYear(start, locale)}${SEPARATOR[locale]}${end ? monthYear(end, locale) : PRESENT[locale]}`;
}

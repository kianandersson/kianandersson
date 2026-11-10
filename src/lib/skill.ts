import type { Locale } from './locale';

export type SkillLevel = 1 | 2 | 3 | 4 | 5;

const LEVEL_LABELS: Record<Locale, Record<SkillLevel, string>> = {
  en: {
    1: 'Knowledge',
    2: 'Good knowledge',
    3: 'Experienced',
    4: 'Very experienced',
    5: 'Expert',
  },
  da: {
    1: 'Kendskab',
    2: 'Godt kendskab',
    3: 'Erfaren',
    4: 'Meget erfaren',
    5: 'Ekspert',
  },
};

export function levelLabel(level: SkillLevel, locale: Locale = 'en'): string {
  return LEVEL_LABELS[locale][level];
}

export function dotArray(level: SkillLevel): { on: number; off: number } {
  return { on: level, off: 5 - level };
}

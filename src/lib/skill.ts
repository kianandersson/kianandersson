export type SkillLevel = 1 | 2 | 3 | 4 | 5;

const LEVEL_LABELS: Record<SkillLevel, string> = {
  1: 'Knowledge',
  2: 'Good knowledge',
  3: 'Experienced',
  4: 'Very experienced',
  5: 'Expert',
};

export function levelLabel(level: SkillLevel): string {
  return LEVEL_LABELS[level];
}

export function dotArray(level: SkillLevel): { on: number; off: number } {
  return { on: level, off: 5 - level };
}

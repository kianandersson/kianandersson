import { formatYears } from '../../../lib/formatYears';
import type { Locale } from '../../../lib/locale';
import { levelLabel, type SkillLevel } from '../../../lib/skill';
import { LevelMeter } from '../../atoms/LevelMeter';
import styles from './SkillRow.module.css';

export type SkillRowProps = {
  name: string;
  level: SkillLevel;
  years: number;
  locale?: Locale;
};

export function SkillRow({ name, level, years, locale = 'en' }: SkillRowProps) {
  return (
    <div className={styles.row}>
      <span className={styles.name}>{name}</span>
      <span className={styles.level}>{levelLabel(level, locale)}</span>
      <span className={styles.years}>{formatYears(years, locale)}</span>
      <div className={styles.meter}>
        <LevelMeter level={level} />
      </div>
    </div>
  );
}

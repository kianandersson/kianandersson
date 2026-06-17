import { formatYears } from '../../../lib/formatYears';
import { levelLabel, type SkillLevel } from '../../../lib/skill';
import { LevelMeter } from '../../atoms/LevelMeter';
import styles from './SkillRow.module.css';

export type SkillRowProps = {
  name: string;
  level: SkillLevel;
  years: number;
};

export function SkillRow({ name, level, years }: SkillRowProps) {
  return (
    <div className={styles.row}>
      <span className={styles.name}>{name}</span>
      <span className={styles.level}>{levelLabel(level)}</span>
      <span className={styles.years}>{formatYears(years)}</span>
      <div className={styles.meter}>
        <LevelMeter level={level} />
      </div>
    </div>
  );
}

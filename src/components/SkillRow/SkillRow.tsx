import { formatYears } from '../../lib/formatYears';
import { levelLabel, type SkillLevel } from '../../lib/skill';
import { LevelMeter } from '../LevelMeter/LevelMeter';
import styles from './SkillRow.module.css';

export type SkillRowProps = {
  name: string;
  level: SkillLevel;
  years: number;
};

export function SkillRow({ name, level, years }: SkillRowProps) {
  return (
    <li className={styles.row}>
      <span className={styles.name}>{name}</span>
      <span className={styles.level}>{levelLabel(level)}</span>
      <span className={styles.years}>{formatYears(years)}</span>
      <div className={styles.meter}>
        <LevelMeter level={level} />
      </div>
    </li>
  );
}

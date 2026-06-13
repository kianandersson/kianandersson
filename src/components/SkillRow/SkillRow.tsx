import { formatYears } from '../../lib/formatYears';
import { levelLabel, type SkillLevel } from '../../lib/skill';
import { DotRating } from '../DotRating/DotRating';
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
      <div className={styles.meta}>
        <span className={styles.level}>{levelLabel(level)}</span>
        <span className={styles.years}>{formatYears(years)}</span>
      </div>
      <div className={styles.dots}>
        <DotRating level={level} />
      </div>
    </li>
  );
}

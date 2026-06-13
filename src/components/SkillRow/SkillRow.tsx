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
    <tr className={styles.row}>
      <td className={styles.nameCell}>{name}</td>
      <td className={styles.levelCell}>{levelLabel(level)}</td>
      <td className={styles.yearsCell}>{formatYears(years)}</td>
      <td className={styles.dotsCell}>
        <DotRating level={level} />
      </td>
    </tr>
  );
}

import { dotArray, type SkillLevel } from '../../lib/skill';
import styles from './DotRating.module.css';

const POSITIONS = [1, 2, 3, 4, 5] as const;

type Props = {
  level: SkillLevel;
};

export function DotRating({ level }: Props) {
  const { on, off } = dotArray(level);
  return (
    <div className={styles.dots} aria-hidden="true">
      {POSITIONS.slice(0, on).map((p) => (
        <span key={`on-${p}`} className={`${styles.dot} ${styles.on}`} data-state="on" />
      ))}
      {POSITIONS.slice(0, off).map((p) => (
        <span key={`off-${p}`} className={`${styles.dot} ${styles.off}`} data-state="off" />
      ))}
    </div>
  );
}

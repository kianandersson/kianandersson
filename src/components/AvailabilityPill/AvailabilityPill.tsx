import { StatusDot } from '../StatusDot/StatusDot';
import styles from './AvailabilityPill.module.css';

// Single source of truth for the badge wording, shared everywhere it appears.
const LABEL = 'Available for new projects';

type Props = {
  /** Animate the status dot. On for live pages, off for static snapshots. */
  pulse?: boolean;
};

export function AvailabilityPill({ pulse = false }: Props) {
  return (
    <span className={styles.pill}>
      <StatusDot pulse={pulse} />
      {LABEL}
    </span>
  );
}

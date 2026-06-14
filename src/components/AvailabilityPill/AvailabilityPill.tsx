import { formatDate } from '../../lib/formatPeriod';
import { StatusDot } from '../StatusDot/StatusDot';
import styles from './AvailabilityPill.module.css';

export type AvailabilityPillProps = { variant: 'available' } | { variant: 'from'; from: Date };

export function AvailabilityPill(props: AvailabilityPillProps) {
  if (props.variant === 'from') {
    return (
      <span className={styles.pill}>
        <StatusDot tone="warn" />
        Available from <span className={styles.date}>{formatDate(props.from)}</span>
      </span>
    );
  }
  return (
    <span className={styles.pill}>
      <StatusDot tone="ok" />
      Available for new projects
    </span>
  );
}

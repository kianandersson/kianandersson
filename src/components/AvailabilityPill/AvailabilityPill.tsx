import { formatDate } from '../../lib/formatPeriod';
import { StatusDot } from '../StatusDot/StatusDot';
import styles from './AvailabilityPill.module.css';

type Props = {
  /** Animate the status dot. On for live pages, off for static snapshots. */
  pulse?: boolean;
  /** When set to a future date, the pill announces the start date instead of immediate availability. */
  from?: Date;
};

export function AvailabilityPill({ pulse = false, from }: Props) {
  return (
    <span className={styles.pill}>
      <StatusDot pulse={pulse && !from} tone={from ? 'warn' : 'ok'} />
      {from ? (
        <>
          Available from <span className={styles.date}>{formatDate(from)}</span>
        </>
      ) : (
        'Available for new projects'
      )}
    </span>
  );
}

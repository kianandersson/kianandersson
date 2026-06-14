import { formatDate } from '../../lib/formatPeriod';
import { StatusDot } from '../StatusDot/StatusDot';
import styles from './AvailabilityPill.module.css';

type Props = {
  /** Animate the green dot when the date is in the past. Off for static snapshots. */
  pulse?: boolean;
  /** Drives the pill state: undefined hides it; past dates render the live pill; future dates announce the start date. */
  availableFrom?: Date;
};

export function AvailabilityPill({ pulse = false, availableFrom }: Props) {
  if (!availableFrom) return null;
  const isFuture = availableFrom.getTime() > Date.now();
  return (
    <span className={styles.pill}>
      <StatusDot pulse={pulse && !isFuture} tone={isFuture ? 'warn' : 'ok'} />
      {isFuture ? (
        <>
          Available from <span className={styles.date}>{formatDate(availableFrom)}</span>
        </>
      ) : (
        'Available for new projects'
      )}
    </span>
  );
}

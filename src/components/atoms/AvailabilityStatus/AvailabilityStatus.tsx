import { formatDate } from '../../../lib/formatDate';
import { StatusIndicator } from '../StatusIndicator';
import styles from './AvailabilityStatus.module.css';

export type AvailabilityStatusProps = {
  availableFrom: Date;
  /** Current time in ms; passed in so the caller controls the clock. */
  now: number;
};

export function AvailabilityStatus({ availableFrom, now }: AvailabilityStatusProps) {
  const isAvailableNow = availableFrom.getTime() <= now;

  return (
    <span class={styles.root} data-state={isAvailableNow ? 'available' : 'future'}>
      <StatusIndicator tone={isAvailableNow ? 'success' : 'warning'} />
      <span class={styles.label}>
        {isAvailableNow ? (
          'Available for work'
        ) : (
          <>
            Available from <span class={styles.date}>{formatDate(availableFrom)}</span>
          </>
        )}
      </span>
    </span>
  );
}

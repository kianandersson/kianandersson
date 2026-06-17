import { formatDate } from '../../../lib/formatDate';
import { StatusIndicator } from '../StatusIndicator';
import styles from './AvailabilityStatus.module.css';

export type AvailabilityStatusProps = {
  availableFrom: Date;
};

export function AvailabilityStatus({ availableFrom }: AvailabilityStatusProps) {
  const isAvailableNow = availableFrom.getTime() <= Date.now();

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

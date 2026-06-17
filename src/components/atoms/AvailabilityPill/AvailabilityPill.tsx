import { formatDate } from '../../../lib/formatDate';
import { StatusDot } from '../StatusDot/StatusDot';
import styles from './AvailabilityPill.module.css';

export type AvailabilityPillProps = {
  availableFrom: Date;
};

export function AvailabilityPill({ availableFrom }: AvailabilityPillProps) {
  const isAvailableNow = availableFrom.getTime() <= Date.now();

  return (
    <span class={styles.pill} data-state={isAvailableNow ? 'available' : 'future'}>
      <StatusDot tone={isAvailableNow ? 'ok' : 'warn'} />
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

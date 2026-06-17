import styles from './StatusIndicator.module.css';

export type StatusTone = 'success' | 'warning';

type Props = {
  /** Color tone — `success` (green, pulses) for live availability, `warning` (orange, static) for pending. */
  tone?: StatusTone;
};

export function StatusIndicator({ tone = 'success' }: Props) {
  return <span className={styles.indicator} data-tone={tone} aria-hidden="true" />;
}

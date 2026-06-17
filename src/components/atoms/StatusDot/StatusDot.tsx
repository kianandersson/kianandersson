import styles from './StatusDot.module.css';

export type StatusTone = 'success' | 'warning';

type Props = {
  /** Color tone — `success` (green, pulses) for live availability, `warning` (orange, static) for pending. */
  tone?: StatusTone;
};

export function StatusDot({ tone = 'success' }: Props) {
  return <span className={styles.dot} data-tone={tone} aria-hidden="true" />;
}

import styles from './StatusDot.module.css';

export type StatusTone = 'ok' | 'warn';

type Props = {
  /** Color tone — `ok` (green, pulses) for live availability, `warn` (orange, static) for pending. */
  tone?: StatusTone;
};

export function StatusDot({ tone = 'ok' }: Props) {
  return <span className={styles.dot} data-tone={tone} aria-hidden="true" />;
}

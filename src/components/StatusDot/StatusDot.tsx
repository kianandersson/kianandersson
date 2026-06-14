import styles from './StatusDot.module.css';

export type StatusTone = 'ok' | 'warn';

type Props = {
  /** Adds the radiating "live" ring. Off by default for static contexts. */
  pulse?: boolean;
  /** Color tone — `ok` (green) for live availability, `warn` (orange) for pending. */
  tone?: StatusTone;
};

export function StatusDot({ pulse = false, tone = 'ok' }: Props) {
  return (
    <span
      className={styles.dot}
      data-pulse={pulse || undefined}
      data-tone={tone}
      aria-hidden="true"
    />
  );
}

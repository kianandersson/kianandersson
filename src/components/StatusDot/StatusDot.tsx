import styles from './StatusDot.module.css';

type Props = {
  /** Adds the radiating "live" ring. Off by default for static contexts. */
  pulse?: boolean;
};

export function StatusDot({ pulse = false }: Props) {
  return <span className={styles.dot} data-pulse={pulse || undefined} aria-hidden="true" />;
}

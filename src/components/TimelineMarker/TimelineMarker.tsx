import styles from './TimelineMarker.module.css';

export function TimelineMarker() {
  return <span className={styles.marker} aria-hidden="true" data-print-hidden="true" />;
}

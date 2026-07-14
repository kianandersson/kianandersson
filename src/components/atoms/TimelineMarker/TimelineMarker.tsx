import styles from './TimelineMarker.module.css';

export type TimelineMarkerTone = 'accent' | 'muted';

type Props = {
  /** `accent` for a top-level entry node, `muted` for a nested project node. */
  tone?: TimelineMarkerTone;
};

export function TimelineMarker({ tone = 'accent' }: Props) {
  return <span className={styles.marker} data-tone={tone} aria-hidden="true" />;
}

import styles from './BranchConnector.module.css';

export type BranchDirection = 'fork' | 'merge';

// A quarter-S curve spanning its box: `fork` leaves the main rail (top-left)
// for the sub-rail (bottom-right); `merge` returns (top-right → bottom-left).
// The box is stretched to the exact rail gap by the parent, so the endpoints
// always land on both rails (preserveAspectRatio="none" + non-scaling stroke).
const PATHS: Record<BranchDirection, string> = {
  fork: 'M0 0 C0 24 28 16 28 40',
  merge: 'M28 0 C28 24 0 16 0 40',
};

type Props = {
  direction: BranchDirection;
};

export function BranchConnector({ direction }: Props) {
  return (
    <svg
      className={styles.connector}
      viewBox="0 0 28 40"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <path d={PATHS[direction]} />
    </svg>
  );
}

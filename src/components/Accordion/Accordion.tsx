import type { ReactNode } from 'react';
import { useId } from 'react';
import styles from './Accordion.module.css';

type Props = {
  title: string;
  count?: number;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
};

export function Accordion({ title, count, isOpen, onToggle, children }: Props) {
  const panelId = useId();

  return (
    <div className={styles.group}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className={styles.trigger}
      >
        <span className={styles.titleGroup}>
          <span className={styles.title}>{title}</span>
          {count !== undefined && <span className={styles.count}>{count}</span>}
        </span>
        <span
          aria-hidden="true"
          className={styles.chevron}
          data-open={isOpen}
          data-print-hidden="true"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <title>chevron</title>
            <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      <div
        id={panelId}
        className={styles.panel}
        data-open={isOpen}
        {...(!isOpen && { inert: true })}
      >
        <div className={styles.panelInner}>{children}</div>
      </div>
    </div>
  );
}

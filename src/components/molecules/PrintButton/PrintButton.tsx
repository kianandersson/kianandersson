import { useCallback } from 'react';
import styles from './PrintButton.module.css';

export function PrintButton() {
  const onClick = useCallback(() => {
    window.print();
  }, []);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Print"
      title="Print"
      className={styles.button}
    >
      <span aria-hidden="true" className={styles.icon}>
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <title>printer</title>
          <path d="M6 9V2h12v7" />
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect width="12" height="8" x="6" y="14" />
        </svg>
      </span>
    </button>
  );
}

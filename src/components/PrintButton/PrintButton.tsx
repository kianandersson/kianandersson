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
          <path d="M6 9V3h12v6" />
          <rect x="3" y="9" width="18" height="9" rx="1.5" />
          <path d="M6 14h12v6H6z" />
        </svg>
      </span>
    </button>
  );
}

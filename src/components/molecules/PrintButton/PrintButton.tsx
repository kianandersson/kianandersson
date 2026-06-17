import { useCallback } from 'react';
import { PrintIcon } from '../../atoms/icons';
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
        <PrintIcon />
      </span>
    </button>
  );
}

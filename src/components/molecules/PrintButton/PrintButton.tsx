import { useCallback } from 'react';
import { PrinterIcon } from '../../atoms/icons';
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
        <PrinterIcon />
      </span>
    </button>
  );
}

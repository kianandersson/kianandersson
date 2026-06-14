import type { Language } from '../../lib/language';
import styles from './Miscellaneous.module.css';

export type { Language };

type Props = {
  languages: Language[];
};

export function Miscellaneous({ languages }: Props) {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <span className={styles.hash} aria-hidden="true">
          ##
        </span>
        <h2 id="miscellaneous-heading" className={styles.heading}>
          Miscellaneous
        </h2>
      </header>
      <div className={styles.row}>
        <span className={styles.rowLabel}>Languages</span>
        <ul className={styles.chips}>
          {languages.map((lang) => (
            <li key={lang.name} className={styles.chip}>
              <span className={styles.chipName}>{lang.name}</span>
              <span className={styles.chipLevel}>{lang.level}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

import { PrintButton } from '../../molecules/PrintButton/PrintButton';
import { ThemeToggle } from '../../molecules/ThemeToggle/ThemeToggle';
import styles from './TopBar.module.css';

type Props = {
  githubHref: string;
  showPrint?: boolean;
};

export function TopBar({ githubHref, showPrint = true }: Props) {
  return (
    <header className={styles.bar}>
      <div className={styles.actions}>
        <a
          href={githubHref}
          aria-label="GitHub"
          title="GitHub"
          className={styles.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
            <title>GitHub</title>
            <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.57.1.78-.25.78-.55 0-.27-.01-.99-.01-1.95-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.2-3.1-.12-.3-.52-1.47.1-3.07 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.83 0c2.22-1.49 3.2-1.18 3.2-1.18.62 1.6.22 2.77.1 3.07.75.81 1.2 1.84 1.2 3.1 0 4.43-2.7 5.41-5.27 5.69.42.36.79 1.07.79 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.2.67.79.55A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
          </svg>
        </a>
        {showPrint ? <PrintButton /> : null}
        <ThemeToggle />
      </div>
    </header>
  );
}

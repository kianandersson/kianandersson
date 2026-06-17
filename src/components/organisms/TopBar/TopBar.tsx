import { GitHubIcon } from '../../atoms/icons';
import { PrintButton } from '../../molecules/PrintButton';
import { ThemeToggle } from '../../molecules/ThemeToggle';
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
          <GitHubIcon />
        </a>
        {showPrint ? <PrintButton /> : null}
        <ThemeToggle />
      </div>
    </header>
  );
}

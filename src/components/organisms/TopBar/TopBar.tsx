import { IconButton } from '../../atoms/IconButton';
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
        <IconButton
          href={githubHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          title="GitHub"
        >
          <GitHubIcon />
        </IconButton>
        {showPrint ? <PrintButton /> : null}
        <ThemeToggle />
      </div>
    </header>
  );
}

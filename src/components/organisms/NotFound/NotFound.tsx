import { CtaButton } from '../../atoms/CtaButton/CtaButton';
import styles from './NotFound.module.css';

type Props = {
  requestedUrl?: string;
};

export function NotFound({ requestedUrl = '/' }: Props) {
  return (
    <div className={styles.root}>
      <div className={styles.eyebrow}>
        <span className={styles.hashes} aria-hidden="true">
          ##
        </span>
        <span className={styles.eyebrowLabel}>ERROR · 404 · NOT FOUND</span>
      </div>

      <h1 className={styles.heading}>This page couldn't be found.</h1>

      <p className={styles.body}>
        The page you're after couldn't be found. It was moved, renamed, or never shipped — let's get
        you back to solid ground.
      </p>

      <div className={styles.terminal} role="presentation">
        <div className={styles.terminalBar}>
          <span className={`${styles.dot} ${styles.dotRed}`} aria-hidden="true" />
          <span className={`${styles.dot} ${styles.dotAmber}`} aria-hidden="true" />
          <span className={`${styles.dot} ${styles.dotGreen}`} aria-hidden="true" />
          <span className={styles.terminalTitle}>zsh</span>
        </div>
        <div className={styles.terminalBody}>
          <div className={styles.line}>
            <span className={styles.prompt}>$</span> curl -I{' '}
            <span className={styles.url} id="requested-url" data-testid="requested-url">
              {requestedUrl}
            </span>
          </div>
          <div className={styles.response}>HTTP/2 404 Not Found</div>
          <div className={styles.response}>content-type: text/html; charset=utf-8</div>
        </div>
      </div>

      <div>
        <CtaButton href="/" direction="back">
          Back to home
        </CtaButton>
      </div>
    </div>
  );
}

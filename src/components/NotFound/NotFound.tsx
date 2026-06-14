import { CtaButton } from '../CtaButton/CtaButton';
import styles from './NotFound.module.css';

type Props = {
  requestedPath?: string;
};

export function NotFound({ requestedPath = '/that-page' }: Props) {
  return (
    <div className={styles.root}>
      <div className={`${styles.rise} ${styles.eyebrow}`}>
        <span className={styles.hashes} aria-hidden="true">
          ##
        </span>
        <span className={styles.eyebrowLabel}>ERROR · 404 · NOT FOUND</span>
      </div>

      <h1 className={`${styles.rise} ${styles.heading}`}>This page couldn't be found.</h1>

      <p className={`${styles.rise} ${styles.body}`}>
        The page you're after couldn't be found. It was moved, renamed, or never shipped — let's get
        you back to <span className={styles.anchor}>solid ground.</span>
      </p>

      <div className={`${styles.rise} ${styles.terminal}`} role="presentation">
        <div className={styles.terminalBar}>
          <span className={`${styles.dot} ${styles.dotRed}`} aria-hidden="true" />
          <span className={`${styles.dot} ${styles.dotAmber}`} aria-hidden="true" />
          <span className={`${styles.dot} ${styles.dotGreen}`} aria-hidden="true" />
          <span className={styles.terminalTitle}>zsh — kianandersson.dk</span>
        </div>
        <div className={styles.terminalBody}>
          <div className={styles.line}>
            <span className={styles.prompt}>$</span> curl -sI kianandersson.dk
            <span className={styles.path} id="requested-path" data-testid="requested-path">
              {requestedPath}
            </span>
          </div>
          <div className={styles.response}>
            HTTP/2 <span className={styles.status}>404</span> Not Found
          </div>
          <div className={styles.response}>content-type: text/html; charset=utf-8</div>
          <div className={styles.response}>x-route-matched: none</div>
        </div>
      </div>

      <div className={styles.rise}>
        <CtaButton href="/" direction="back">
          Back to home
        </CtaButton>
      </div>
    </div>
  );
}

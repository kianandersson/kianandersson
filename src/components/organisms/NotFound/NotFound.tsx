import { Button } from '../../atoms/Button';
import { Heading } from '../../atoms/Heading';
import { ArrowIcon } from '../../atoms/icons';
import { Text } from '../../atoms/Text';
import { Window } from '../../molecules/Window';
import styles from './NotFound.module.css';

type Props = {
  requestedUrl?: string;
  /** Destination for the "Back to home" CTA. Required so the component
   *  doesn't bake a concrete site path into itself. */
  homeHref: string;
};

export function NotFound({ requestedUrl = '/', homeHref }: Props) {
  return (
    <div className={styles.root}>
      <div className={styles.eyebrow}>
        <span className={styles.hashes} aria-hidden="true">
          ##
        </span>
        <span className={styles.eyebrowLabel}>
          <Text font="mono" size="caption-s" tone="muted">
            ERROR · 404 · NOT FOUND
          </Text>
        </span>
      </div>

      <Heading level={1} size="l">
        This page couldn't be found.
      </Heading>

      <div className={styles.body}>
        <Text as="p" font="sans" size="subheading" tone="muted">
          The page you're after couldn't be found. It was moved, renamed, or never shipped — let's
          get you back to solid ground.
        </Text>
      </div>

      <Window
        title={
          <Text font="mono" size="caption-s" tone="muted">
            zsh
          </Text>
        }
      >
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
      </Window>

      <div className={styles.backButton}>
        <Button href={homeHref}>
          <span className={styles.arrow} aria-hidden="true">
            <ArrowIcon direction="left" size={16} />
          </span>
          Back to home
        </Button>
      </div>
    </div>
  );
}

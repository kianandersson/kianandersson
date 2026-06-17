import { Button } from '../../atoms/Button';
import { Heading } from '../../atoms/Heading';
import { ArrowIcon } from '../../atoms/icons';
import { Text } from '../../atoms/Text';
import { Window } from '../../molecules/Window';
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
        <Text font="mono" size="caption-s" tone="muted" class={styles.eyebrowLabel}>
          ERROR · 404 · NOT FOUND
        </Text>
      </div>

      <Heading level={1} size="l">
        This page couldn't be found.
      </Heading>

      <Text as="p" font="sans" size="subheading" tone="muted" class={styles.body}>
        The page you're after couldn't be found. It was moved, renamed, or never shipped — let's get
        you back to solid ground.
      </Text>

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

      <div>
        <Button href="/" size="lg" class={styles.backButton}>
          <ArrowIcon direction="left" size={16} />
          Back to home
        </Button>
      </div>
    </div>
  );
}

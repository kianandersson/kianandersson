import type { ComponentChildren } from 'preact';
import { Heading } from '../../atoms/Heading';
import { Text } from '../../atoms/Text';
import styles from './Hero.module.css';

type Props = {
  name: string;
  tagline: string;
  /** Print only: show the square profile photo in the top-right corner. */
  showProfilePhoto?: boolean;
  children?: ComponentChildren;
};

export function Hero({ name, tagline, showProfilePhoto = false, children }: Props) {
  return (
    <div className={styles.root}>
      <div className={styles.lead}>
        {showProfilePhoto && (
          // Decorative on a CV — the name is already in the heading. Hidden on
          // screen and revealed only when printing (see Hero.module.css).
          <img className={styles.photo} src="/profile.jpg" alt="" />
        )}
        <div className={styles.text}>
          <Heading level={1} size="display-xl">
            Hi, I'm <span className={styles.name}>{name}</span>.
          </Heading>
          <div className={styles.body}>
            <Text as="p" size="heading-s" tone="muted">
              {tagline}
            </Text>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

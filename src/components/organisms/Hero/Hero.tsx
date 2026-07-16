import type { ComponentChildren } from 'preact';
import { toParagraphs } from '../../../lib/paragraphs';
import { Heading } from '../../atoms/Heading';
import { Text } from '../../atoms/Text';
import styles from './Hero.module.css';

type Props = {
  name: string;
  /** Intro copy; blank lines (a `\n\n` break) separate paragraphs. */
  tagline: string;
  /** Print only. */
  showProfilePhoto?: boolean;
  children?: ComponentChildren;
};

export function Hero({ name, tagline, showProfilePhoto = false, children }: Props) {
  const paragraphs = toParagraphs(tagline);
  return (
    <div className={styles.root}>
      <div className={styles.lead}>
        {showProfilePhoto && (
          // Decorative: the name is already in the heading, so the alt is empty.
          <img className={styles.photo} src="/profile.jpg" alt="" />
        )}
        <div className={styles.text}>
          <Heading level={1} size="display-xl">
            Hi, I'm <span className={styles.name}>{name}</span>.
          </Heading>
          <div className={styles.body}>
            {paragraphs.map((paragraph) => (
              <Text key={paragraph} as="p" size="heading-s" tone="muted">
                {paragraph}
              </Text>
            ))}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

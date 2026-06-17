import type { ComponentChildren } from 'preact';
import { Heading } from '../../atoms/Heading';
import { Text } from '../../atoms/Text';
import styles from './Hero.module.css';

type Props = {
  name: string;
  tagline: string;
  children?: ComponentChildren;
};

export function Hero({ name, tagline, children }: Props) {
  return (
    <div className={styles.root}>
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
      {children}
    </div>
  );
}

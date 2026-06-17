import type { ComponentChildren } from 'preact';
import { Heading } from '../../atoms/Heading';
import { Text } from '../../atoms/Text';
import styles from './Hero.module.css';

type Props = {
  name: string;
  children?: ComponentChildren;
};

const PLACEHOLDER_BODY =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.';

export function Hero({ name, children }: Props) {
  return (
    <div className={styles.root}>
      <div className={styles.text}>
        <Heading level={1} size="display-xl">
          Hi, I'm <span className={styles.name}>{name}</span>.
        </Heading>
        <Text as="p" size="heading-s" tone="muted" class={styles.body}>
          {PLACEHOLDER_BODY}
        </Text>
      </div>
      {children}
    </div>
  );
}

import type { ComponentChildren } from 'preact';
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
        <h1 className={styles.heading}>
          Hi, I'm <span className={styles.name}>{name}</span>.
        </h1>
        <p className={styles.body}>{PLACEHOLDER_BODY}</p>
      </div>
      {children}
    </div>
  );
}

import type { ComponentChildren } from 'preact';
import { Button, type Props as ButtonProps } from '../Button';
import styles from './IconButton.module.css';

export type Props = ButtonProps & {
  children: ComponentChildren;
  'aria-label': string;
};

export function IconButton(props: Props) {
  const { class: className, children, ...rest } = props;
  const combined = className ? `${styles.button} ${className}` : styles.button;
  return (
    <Button {...(rest as ButtonProps)} class={combined}>
      <span aria-hidden="true" class={styles.icon}>
        {children}
      </span>
    </Button>
  );
}

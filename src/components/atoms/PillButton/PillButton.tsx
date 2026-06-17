import { Button, type Props as ButtonProps } from '../Button';
import styles from './PillButton.module.css';

export type PillSize = 'md' | 'lg';

export type Props = ButtonProps & {
  size?: PillSize;
};

export function PillButton(props: Props) {
  const { class: className, size = 'md', ...rest } = props;
  const sizeClass = size === 'lg' ? styles.lg : styles.md;
  const combined = className
    ? `${styles.pill} ${sizeClass} ${className}`
    : `${styles.pill} ${sizeClass}`;
  return <Button {...(rest as ButtonProps)} class={combined} />;
}

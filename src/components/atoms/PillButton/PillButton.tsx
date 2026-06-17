import { Button, type Props as ButtonProps } from '../Button';
import styles from './PillButton.module.css';

export type PillSize = 'md' | 'lg';

export type Props = ButtonProps & {
  size?: PillSize;
};

export function PillButton(props: Props) {
  const { class: className, size = 'lg', ...rest } = props;
  const combined = className ? `${styles.pill} ${className}` : styles.pill;
  return <Button {...(rest as ButtonProps)} class={combined} data-size={size} />;
}

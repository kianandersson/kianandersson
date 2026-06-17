import { Button, type Props as ButtonProps } from '../Button';
import styles from './TextLink.module.css';

export type TextLinkTone = 'muted' | 'default';

export type Props = ButtonProps & {
  tone?: TextLinkTone;
};

export function TextLink(props: Props) {
  const { class: className, tone = 'muted', ...rest } = props;
  const combined = className ? `${styles.link} ${className}` : styles.link;
  return <Button {...(rest as ButtonProps)} class={combined} data-tone={tone} />;
}

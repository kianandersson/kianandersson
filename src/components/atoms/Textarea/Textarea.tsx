import type { JSX } from 'preact';
import styles from './Textarea.module.css';

export type Props = JSX.IntrinsicElements['textarea'];

export function Textarea({ class: className, ...rest }: Props) {
  const combined = className ? `${styles.textarea} ${className}` : styles.textarea;
  return <textarea {...rest} class={combined} />;
}

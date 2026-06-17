import type { JSX } from 'preact';
import styles from './Textarea.module.css';

export type Props = Omit<JSX.IntrinsicElements['textarea'], 'class' | 'className'>;

export function Textarea(props: Props) {
  return <textarea {...props} class={styles.textarea} />;
}

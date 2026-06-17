import type { JSX } from 'preact';
import styles from './TextInput.module.css';

export type TextInputType = 'text' | 'email' | 'tel' | 'url' | 'search';

type OwnProps = {
  type?: TextInputType;
};

export type Props = Omit<JSX.IntrinsicElements['input'], 'type' | 'size' | 'class' | 'className'> &
  OwnProps;

export function TextInput({ type = 'text', ...rest }: Props) {
  return <input {...rest} type={type} class={styles.input} />;
}

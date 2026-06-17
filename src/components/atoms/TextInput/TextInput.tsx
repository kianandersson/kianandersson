import type { JSX } from 'preact';
import styles from './TextInput.module.css';

export type TextInputType = 'text' | 'email' | 'tel' | 'url' | 'search';

type OwnProps = {
  type?: TextInputType;
};

export type Props = Omit<JSX.IntrinsicElements['input'], 'type' | 'size'> & OwnProps;

export function TextInput({ class: className, type = 'text', ...rest }: Props) {
  const combined = className ? `${styles.input} ${className}` : styles.input;
  return <input {...rest} type={type} class={combined} />;
}

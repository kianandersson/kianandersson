import type { JSX } from 'preact';
import styles from './TextInput.module.css';

export type TextInputType = 'text' | 'email' | 'tel' | 'url' | 'search';

type Props = {
  id?: string;
  type?: TextInputType;
  value?: string;
  placeholder?: string;
  autocomplete?: string;
  inputMode?: 'email' | 'text' | 'tel' | 'url' | 'numeric' | 'search';
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  class?: string;
  onInput?: JSX.GenericEventHandler<HTMLInputElement>;
  onChange?: JSX.GenericEventHandler<HTMLInputElement>;
  onBlur?: JSX.FocusEventHandler<HTMLInputElement>;
  onFocus?: JSX.FocusEventHandler<HTMLInputElement>;
};

export function TextInput({ class: className, type = 'text', ...rest }: Props) {
  const combined = className ? `${styles.input} ${className}` : styles.input;
  return <input {...rest} type={type} class={combined} />;
}

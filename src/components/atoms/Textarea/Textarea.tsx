import type { JSX } from 'preact';
import styles from './Textarea.module.css';

type Props = {
  id?: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  rows?: number;
  class?: string;
  'aria-label'?: string;
  onInput?: JSX.GenericEventHandler<HTMLTextAreaElement>;
  onChange?: JSX.GenericEventHandler<HTMLTextAreaElement>;
  onBlur?: JSX.FocusEventHandler<HTMLTextAreaElement>;
  onFocus?: JSX.FocusEventHandler<HTMLTextAreaElement>;
};

export function Textarea({ class: className, ...rest }: Props) {
  const combined = className ? `${styles.textarea} ${className}` : styles.textarea;
  return <textarea {...rest} class={combined} />;
}

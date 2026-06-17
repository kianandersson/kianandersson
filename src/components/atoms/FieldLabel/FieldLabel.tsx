import type { ComponentChildren } from 'preact';
import styles from './FieldLabel.module.css';

export type FieldLabelTone = 'subtle' | 'muted';

type Props = {
  /** When provided, renders a `<label for={...}>` linked to the input. */
  for?: string;
  tone?: FieldLabelTone;
  children: ComponentChildren;
  class?: string;
};

export function FieldLabel({ for: htmlFor, tone = 'subtle', children, class: className }: Props) {
  const combined = className ? `${styles.label} ${className}` : styles.label;
  if (htmlFor !== undefined) {
    return (
      <label for={htmlFor} class={combined} data-tone={tone}>
        {children}
      </label>
    );
  }
  return (
    <span class={combined} data-tone={tone}>
      {children}
    </span>
  );
}

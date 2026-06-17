import type { ComponentChildren } from 'preact';
import styles from './FieldLabel.module.css';

export type FieldLabelTone = 'subtle' | 'muted';

type Props = {
  /** Id of the form control this label is for. Required — a label without an associated input has no business existing. */
  for: string;
  tone?: FieldLabelTone;
  children: ComponentChildren;
  class?: string;
};

export function FieldLabel({ for: htmlFor, tone = 'subtle', children, class: className }: Props) {
  const combined = className ? `${styles.label} ${className}` : styles.label;
  return (
    <label for={htmlFor} class={combined} data-tone={tone}>
      {children}
    </label>
  );
}

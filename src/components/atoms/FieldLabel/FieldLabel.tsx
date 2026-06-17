import type { ComponentChildren } from 'preact';
import styles from './FieldLabel.module.css';

type Props = {
  /** Id of the form control this label is for. Required — a label without an associated input has no business existing. */
  for: string;
  children: ComponentChildren;
};

export function FieldLabel({ for: htmlFor, children }: Props) {
  return (
    <label for={htmlFor} class={styles.label}>
      {children}
    </label>
  );
}

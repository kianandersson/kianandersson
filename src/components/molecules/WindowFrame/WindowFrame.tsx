import type { ComponentChildren } from 'preact';
import styles from './WindowFrame.module.css';

type Props = {
  /** Optional title shown next to the traffic lights (e.g. "zsh"). */
  title?: ComponentChildren;
  /** Visual variant — `card` for static windows, `form` when used as a `<form>` shell. */
  as?: 'div' | 'form';
  /** Forwarded to the underlying root element. */
  'aria-label'?: string;
  onSubmit?: (event: Event) => void;
  noValidate?: boolean;
  class?: string;
  children: ComponentChildren;
};

export function WindowFrame({
  title,
  as: Tag = 'div',
  'aria-label': ariaLabel,
  onSubmit,
  noValidate,
  class: className,
  children,
}: Props) {
  const combined = className ? `${styles.window} ${className}` : styles.window;
  return (
    <Tag
      class={combined}
      aria-label={ariaLabel}
      onSubmit={onSubmit}
      noValidate={Tag === 'form' ? noValidate : undefined}
    >
      <div class={styles.titleBar}>
        <span class={`${styles.trafficDot} ${styles.dotRed}`} aria-hidden="true" />
        <span class={`${styles.trafficDot} ${styles.dotAmber}`} aria-hidden="true" />
        <span class={`${styles.trafficDot} ${styles.dotGreen}`} aria-hidden="true" />
        {title !== undefined ? <span class={styles.title}>{title}</span> : null}
      </div>
      {children}
    </Tag>
  );
}

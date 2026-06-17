import type { ComponentChildren } from 'preact';
import styles from './Window.module.css';

type Props = {
  /** Optional title shown next to the traffic lights (e.g. "zsh"). */
  title?: ComponentChildren;
  class?: string;
  children: ComponentChildren;
};

/**
 * Presentational window chrome — titlebar with traffic lights plus a body slot.
 * Stays div-only on purpose: wrap it externally with a `<form>` / `<dialog>` /
 * `<aside>` when you need element-specific semantics.
 */
export function Window({ title, class: className, children }: Props) {
  const combined = className ? `${styles.window} ${className}` : styles.window;
  return (
    <div class={combined}>
      <div class={styles.titleBar}>
        <span class={`${styles.trafficDot} ${styles.dotRed}`} aria-hidden="true" />
        <span class={`${styles.trafficDot} ${styles.dotAmber}`} aria-hidden="true" />
        <span class={`${styles.trafficDot} ${styles.dotGreen}`} aria-hidden="true" />
        {title !== undefined ? <span class={styles.title}>{title}</span> : null}
      </div>
      {children}
    </div>
  );
}

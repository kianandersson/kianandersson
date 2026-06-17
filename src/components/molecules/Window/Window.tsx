import type { ComponentChildren } from 'preact';
import styles from './Window.module.css';

type Props = {
  /** Optional title shown next to the traffic lights (e.g. "zsh"). */
  title?: ComponentChildren;
  children: ComponentChildren;
};

/**
 * Presentational window chrome — titlebar with traffic lights plus a body slot.
 * Stays div-only on purpose: wrap it externally with a `<form>` / `<dialog>` /
 * `<aside>` when you need element-specific semantics.
 */
export function Window({ title, children }: Props) {
  return (
    <div class={styles.window}>
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

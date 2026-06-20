import styles from './DefinitionItem.module.css';

type Props = {
  label: string;
  value: string;
  /** When set, the value renders as a link to this URL. */
  href?: string;
};

/**
 * A single label/value pair (`dt`/`dd`) for a description grid. Render inside a
 * `<dl>` — the parent owns the grid layout, this owns the pair's typography.
 */
export function DefinitionItem({ label, value, href }: Props) {
  return (
    <div class={styles.item}>
      <dt class={styles.label}>{label}</dt>
      <dd class={styles.value}>
        {href ? (
          <a class={styles.link} href={href}>
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

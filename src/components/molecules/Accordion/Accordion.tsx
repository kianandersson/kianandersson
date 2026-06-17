import type { ComponentChildren } from 'preact';
import { useId } from 'preact/hooks';
import { Button } from '../../atoms/Button';
import { ChevronIcon } from '../../atoms/icons';
import styles from './Accordion.module.css';

type Props = {
  title: string;
  count?: number;
  isOpen: boolean;
  onToggle: () => void;
  children: ComponentChildren;
};

export function Accordion({ title, count, isOpen, onToggle, children }: Props) {
  const panelId = useId();

  return (
    <div className={styles.group}>
      <Button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        class={styles.trigger}
      >
        <span className={styles.titleGroup}>
          <span className={styles.title}>{title}</span>
          {count !== undefined && <span className={styles.count}>{count}</span>}
        </span>
        <span aria-hidden="true" className={styles.chevron} data-open={isOpen}>
          <ChevronIcon direction="down" />
        </span>
      </Button>
      <div
        id={panelId}
        className={styles.panel}
        data-open={isOpen}
        {...(!isOpen && { inert: true })}
      >
        <div className={styles.panelInner}>{children}</div>
      </div>
    </div>
  );
}

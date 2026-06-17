import type { ComponentChildren } from 'preact';
import { Heading, type HeadingLevel, type HeadingSize } from '../../atoms/Heading';
import styles from './SectionHeader.module.css';

type Props = {
  title: string;
  level?: HeadingLevel;
  size?: HeadingSize;
  id?: string;
  /** Optional trailing slot — e.g. a "See all" link aligned to the end. */
  action?: ComponentChildren;
};

export function SectionHeader({ title, level = 2, size = 'm', id, action }: Props) {
  return (
    <header class={styles.header}>
      <span class={styles.hash} aria-hidden="true">
        ##
      </span>
      <Heading level={level} size={size} id={id} class={styles.heading}>
        {title}
      </Heading>
      {action !== undefined ? <span class={styles.action}>{action}</span> : null}
    </header>
  );
}

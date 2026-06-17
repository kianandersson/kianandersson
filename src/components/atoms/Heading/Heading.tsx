import type { ComponentChildren } from 'preact';
import styles from './Heading.module.css';

export type HeadingLevel = 1 | 2 | 3;
export type HeadingSize = 'display-xl' | 'display-l' | 'l' | 'm' | 's';

type Props = {
  level: HeadingLevel;
  size: HeadingSize;
  children: ComponentChildren;
  id?: string;
};

const TAGS = { 1: 'h1', 2: 'h2', 3: 'h3' } as const;

export function Heading({ level, size, children, id }: Props) {
  const Tag = TAGS[level];
  return (
    <Tag id={id} class={styles.heading} data-size={size}>
      {children}
    </Tag>
  );
}

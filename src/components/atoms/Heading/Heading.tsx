import type { ComponentChildren } from 'preact';
import styles from './Heading.module.css';

export type HeadingLevel = 1 | 2 | 3;
export type HeadingSize = 'display-xl' | 'display-l' | 'l' | 'm' | 's';

type Props = {
  level: HeadingLevel;
  size: HeadingSize;
  children: ComponentChildren;
  class?: string;
  id?: string;
};

export function Heading({ level, size, children, class: className, id }: Props) {
  const combined = className ? `${styles.heading} ${className}` : styles.heading;
  const dataProps = { 'data-size': size, class: combined, id };
  if (level === 1) return <h1 {...dataProps}>{children}</h1>;
  if (level === 2) return <h2 {...dataProps}>{children}</h2>;
  return <h3 {...dataProps}>{children}</h3>;
}

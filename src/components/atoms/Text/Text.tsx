import type { ComponentChildren } from 'preact';
import styles from './Text.module.css';

export type TextSize = 'caption-s' | 'caption-m' | 'label' | 'body' | 'subheading' | 'heading-s';
export type TextTone = 'default' | 'muted' | 'subtle' | 'accent' | 'accent-strong';
export type TextFont = 'sans' | 'mono';
export type TextWeight = 'regular' | 'medium' | 'semibold';
export type TextAs = 'p' | 'span' | 'div';

type Props = {
  as?: TextAs;
  size?: TextSize;
  tone?: TextTone;
  font?: TextFont;
  weight?: TextWeight;
  children: ComponentChildren;
  class?: string;
  id?: string;
  'aria-hidden'?: boolean;
  role?: 'status' | 'note';
};

export function Text({
  as: Tag = 'span',
  size = 'body',
  tone = 'default',
  font = 'sans',
  weight = 'regular',
  children,
  class: className,
  id,
  'aria-hidden': ariaHidden,
  role,
}: Props) {
  const combined = className ? `${styles.text} ${className}` : styles.text;
  return (
    <Tag
      id={id}
      role={role}
      aria-hidden={ariaHidden}
      class={combined}
      data-size={size}
      data-tone={tone}
      data-font={font}
      data-weight={weight}
    >
      {children}
    </Tag>
  );
}

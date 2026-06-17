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
  id,
  'aria-hidden': ariaHidden,
  role,
}: Props) {
  return (
    <Tag
      id={id}
      role={role}
      aria-hidden={ariaHidden}
      class={styles.text}
      data-size={size}
      data-tone={tone}
      data-font={font}
      data-weight={weight}
    >
      {children}
    </Tag>
  );
}

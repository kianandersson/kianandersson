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
  as = 'span',
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
  if (as === 'p') {
    return (
      <p
        id={id}
        role={role}
        aria-hidden={ariaHidden}
        class={combined}
        {...({
          'data-size': size,
          'data-tone': tone,
          'data-font': font,
          'data-weight': weight,
        } as Record<string, string>)}
      >
        {children}
      </p>
    );
  }
  if (as === 'div') {
    return (
      <div
        id={id}
        role={role}
        aria-hidden={ariaHidden}
        class={combined}
        {...({
          'data-size': size,
          'data-tone': tone,
          'data-font': font,
          'data-weight': weight,
        } as Record<string, string>)}
      >
        {children}
      </div>
    );
  }
  return (
    <span
      id={id}
      role={role}
      aria-hidden={ariaHidden}
      class={combined}
      {...({
        'data-size': size,
        'data-tone': tone,
        'data-font': font,
        'data-weight': weight,
      } as Record<string, string>)}
    >
      {children}
    </span>
  );
}

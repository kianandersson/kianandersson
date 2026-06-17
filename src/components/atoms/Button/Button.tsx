import type { ComponentChildren, JSX } from 'preact';
import styles from './Button.module.css';

type SharedProps = {
  children?: ComponentChildren;
  class?: string;
  id?: string;
  title?: string;
  'aria-label'?: string;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
  'aria-pressed'?: boolean;
  inert?: boolean;
};

type DataAttrs = {
  [key: `data-${string}`]: string | boolean | undefined;
};

export type AnchorProps = SharedProps &
  DataAttrs & {
    href: string;
    target?: string;
    rel?: string;
    onClick?: JSX.MouseEventHandler<HTMLAnchorElement>;
  };

export type ButtonOnlyProps = SharedProps &
  DataAttrs & {
    href?: undefined;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    onClick?: JSX.MouseEventHandler<HTMLButtonElement>;
  };

export type Props = AnchorProps | ButtonOnlyProps;

export function Button(props: Props) {
  const { children, class: className } = props;
  const combined = className ? `${styles.reset} ${className}` : styles.reset;

  if ('href' in props && props.href !== undefined) {
    const { href, target, rel, onClick, ...passthrough } = props;
    const safeRel = target === '_blank' ? (rel ?? 'noopener noreferrer') : rel;
    return (
      <a
        {...stripCommon(passthrough)}
        href={href}
        target={target}
        rel={safeRel}
        onClick={onClick}
        class={combined}
      >
        {children}
      </a>
    );
  }

  const { type = 'button', disabled, onClick, ...passthrough } = props as ButtonOnlyProps;
  return (
    <button
      {...stripCommon(passthrough)}
      type={type}
      disabled={disabled}
      onClick={onClick}
      class={combined}
    >
      {children}
    </button>
  );
}

function stripCommon<T extends { children?: ComponentChildren; class?: string }>(
  props: T,
): Omit<T, 'children' | 'class'> {
  const { children: _c, class: _cn, ...rest } = props;
  return rest;
}

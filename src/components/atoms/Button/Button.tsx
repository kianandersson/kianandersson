import type { ComponentChildren, JSX, Ref } from 'preact';
import styles from './Button.module.css';

type SharedProps = {
  children?: ComponentChildren;
  id?: string;
  title?: string;
  'aria-label'?: string;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
  'aria-pressed'?: boolean;
  'data-testid'?: string;
  inert?: boolean;
};

export type AnchorProps = SharedProps & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: JSX.MouseEventHandler<HTMLAnchorElement>;
  ref?: Ref<HTMLAnchorElement>;
};

export type ButtonOnlyProps = SharedProps & {
  href?: undefined;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: JSX.MouseEventHandler<HTMLButtonElement>;
  ref?: Ref<HTMLButtonElement>;
};

export type Props = AnchorProps | ButtonOnlyProps;

export function Button(props: Props) {
  const { children } = props;

  const shared = {
    id: props.id,
    title: props.title,
    inert: props.inert,
    class: styles.button,
    'aria-label': props['aria-label'],
    'aria-expanded': props['aria-expanded'],
    'aria-controls': props['aria-controls'],
    'aria-pressed': props['aria-pressed'],
    'data-testid': props['data-testid'],
  } as const;

  if ('href' in props && props.href !== undefined) {
    const safeRel = props.target === '_blank' ? (props.rel ?? 'noopener noreferrer') : props.rel;
    return (
      <a
        ref={props.ref}
        href={props.href}
        target={props.target}
        rel={safeRel}
        onClick={props.onClick}
        {...shared}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={props.ref}
      type={props.type ?? 'button'}
      disabled={props.disabled}
      onClick={props.onClick}
      {...shared}
    >
      {children}
    </button>
  );
}

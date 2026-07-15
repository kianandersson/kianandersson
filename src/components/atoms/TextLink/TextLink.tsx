import type { ComponentChildren, MouseEventHandler, Ref } from 'preact';
import styles from './TextLink.module.css';

export type TextLinkTone = 'muted' | 'default';

type SharedProps = {
  children?: ComponentChildren;
  tone?: TextLinkTone;
  /** Inline variant: drops padding, inherits font + nowrap from the
   *  surrounding text. Use inside a sentence; the default chip styling
   *  is for standalone affordances. */
  inline?: boolean;
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
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  ref?: Ref<HTMLAnchorElement>;
};

export type ButtonProps = SharedProps & {
  href?: undefined;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  ref?: Ref<HTMLButtonElement>;
};

export type Props = AnchorProps | ButtonProps;

export function TextLink(props: Props) {
  const { children, tone = 'muted', inline = false } = props;
  const toneClass = tone === 'default' ? styles.default : styles.muted;
  const combined = `${styles.link} ${toneClass}${inline ? ` ${styles.inline}` : ''}`;

  const shared = {
    id: props.id,
    title: props.title,
    inert: props.inert,
    class: combined,
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

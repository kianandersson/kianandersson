import type { ComponentChildren } from 'preact';
import { Button } from '../Button';
import { ArrowIcon } from '../icons';
import styles from './CtaButton.module.css';

export type CtaDirection = 'forward' | 'back';

type Props = {
  href: string;
  children: ComponentChildren;
  direction?: CtaDirection;
};

export function CtaButton({ href, children, direction = 'forward' }: Props) {
  const isBack = direction === 'back';
  const ctaClass = `${styles.cta} ${isBack ? styles.back : styles.forward}`;
  const arrow = (
    <span aria-hidden="true" data-cta-arrow class={styles.arrow}>
      <ArrowIcon direction={isBack ? 'left' : 'right'} />
    </span>
  );
  return (
    <Button class={ctaClass} href={href}>
      {isBack ? arrow : null}
      <span class={styles.label}>{children}</span>
      {isBack ? null : arrow}
    </Button>
  );
}

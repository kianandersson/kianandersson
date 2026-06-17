import type { ComponentChildren } from 'preact';
import { ArrowIcon } from '../icons';
import styles from './CtaButton.module.css';

export type CtaDirection = 'forward' | 'back';

type Props = {
  href: string;
  children: ComponentChildren;
  direction?: CtaDirection;
};

export function CtaButton({ href, children, direction = 'forward' }: Props) {
  return (
    <a className={styles.cta} data-direction={direction} href={href}>
      {direction === 'back' ? (
        <span aria-hidden="true" data-cta-arrow className={styles.arrow}>
          <ArrowIcon direction="left" />
        </span>
      ) : null}
      <span className={styles.label}>{children}</span>
      {direction === 'forward' ? (
        <span aria-hidden="true" data-cta-arrow className={styles.arrow}>
          <ArrowIcon direction="right" />
        </span>
      ) : null}
    </a>
  );
}

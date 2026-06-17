import type { ComponentChildren } from 'preact';
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
      {direction === 'back' ? <Arrow direction="back" /> : null}
      <span className={styles.label}>{children}</span>
      {direction === 'forward' ? <Arrow direction="forward" /> : null}
    </a>
  );
}

function Arrow({ direction }: { direction: CtaDirection }) {
  return (
    <span aria-hidden="true" data-cta-arrow className={styles.arrow}>
      {direction === 'back' ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <title>arrow-left</title>
          <path d="M19 12H5" />
          <path d="M11 6l-6 6 6 6" />
        </svg>
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <title>arrow-right</title>
          <path d="M5 12h14" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      )}
    </span>
  );
}

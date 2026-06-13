import styles from './Hero.module.css';

export type HeroProps = {
  name: string;
  available: boolean;
  ctaHref: string;
};

const PLACEHOLDER_BODY =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.';

export function Hero({ name, available, ctaHref }: HeroProps) {
  const dotClass = available ? styles.dot : `${styles.dot} ${styles.dotInactive}`;
  const statusLabel = available
    ? 'Available for new projects.'
    : 'Not available for new projects right now.';

  return (
    <section className={styles.hero}>
      <h1 className={styles.heading}>
        Hi, I'm <span className={styles.name}>{name}</span>.
      </h1>

      <p className={styles.body}>{PLACEHOLDER_BODY}</p>

      <p className={styles.availability}>
        <span className={dotClass} aria-hidden="true" />
        {statusLabel}
      </p>

      <div className={styles.ctaWrapper}>
        <a className={styles.cta} href={ctaHref}>
          Get in touch
        </a>
      </div>
    </section>
  );
}

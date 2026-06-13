import styles from './Hero.module.css';

export type HeroProps = {
  name: string;
  available: boolean;
  ctaHref: string;
};

const PLACEHOLDER_BODY =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.';

export function Hero({ name, available, ctaHref }: HeroProps) {
  return (
    <div>
      <h1 className={styles.heading}>
        Hi, I'm <span className={styles.name}>{name}</span>.
      </h1>

      <p className={styles.body}>{PLACEHOLDER_BODY}</p>

      {available ? (
        <p className={styles.availability}>
          <span className={styles.dot} aria-hidden="true" />
          Available for new projects.
        </p>
      ) : null}

      <div className={styles.ctaWrapper}>
        <a className={styles.cta} href={ctaHref}>
          Get in touch
          <svg
            className={styles.arrow}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>
    </div>
  );
}

import { CtaButton } from '../CtaButton/CtaButton';
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
    <div className={styles.root}>
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

      <CtaButton href={ctaHref}>Get in touch</CtaButton>
    </div>
  );
}

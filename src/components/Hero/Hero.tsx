import { AvailabilityPill } from '../AvailabilityPill/AvailabilityPill';
import { CtaButton } from '../CtaButton/CtaButton';
import styles from './Hero.module.css';

export type HeroProps = {
  name: string;
  availableFrom?: Date;
  ctaHref: string;
};

const PLACEHOLDER_BODY =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.';

export function Hero({ name, availableFrom, ctaHref }: HeroProps) {
  return (
    <div className={styles.root}>
      <h1 className={styles.heading}>
        Hi, I'm <span className={styles.name}>{name}</span>.
      </h1>

      <p className={styles.body}>{PLACEHOLDER_BODY}</p>

      {availableFrom != null &&
        (availableFrom.getTime() > Date.now() ? (
          <AvailabilityPill variant="from" from={availableFrom} />
        ) : (
          <AvailabilityPill variant="available" />
        ))}

      <CtaButton href={ctaHref}>Get in touch</CtaButton>
    </div>
  );
}

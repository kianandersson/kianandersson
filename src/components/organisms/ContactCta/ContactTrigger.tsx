import { Button } from '../../atoms/Button';
import { ArrowIcon, CloseIcon, ContactIcon } from '../../atoms/icons';
import { PillButton } from '../../atoms/PillButton';
import styles from './ContactCta.module.css';

export type ContactTriggerVariant = 'icon' | 'labelled';

type Props = {
  variant: ContactTriggerVariant;
  isOpen: boolean;
  ariaLabel: string;
  controlsId: string;
  onClick: () => void;
};

/**
 * Trigger button for ContactCta. Picks between the icon-only round button
 * (shown alongside an AvailabilityPill) and the labelled pill ("Get in touch").
 *
 * The icon-stack/arrow-slot animation lives in ContactCta.module.css —
 * this component just owns which shape renders and wires up the a11y.
 */
export function ContactTrigger({ variant, isOpen, ariaLabel, controlsId, onClick }: Props) {
  if (variant === 'icon') {
    return (
      <Button
        type="button"
        class={styles.iconButton}
        aria-expanded={isOpen}
        aria-controls={controlsId}
        aria-label={ariaLabel}
        onClick={onClick}
      >
        <span class={styles.iconStack} aria-hidden="true">
          <ContactIcon class={styles.icAt} size={18} />
          <ArrowIcon class={styles.icArrow} size={17} direction="right" />
          <CloseIcon class={styles.icX} size={16} />
        </span>
      </Button>
    );
  }

  return (
    <PillButton
      type="button"
      class={styles.labelledButton}
      aria-expanded={isOpen}
      aria-controls={controlsId}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <span class={styles.labelText}>Get in touch</span>
      <span class={styles.arrowSlot} aria-hidden="true">
        <ArrowIcon class={styles.icArrow} size={15} direction="right" />
        <CloseIcon class={styles.icX} size={15} />
      </span>
    </PillButton>
  );
}

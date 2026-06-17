import { Button } from '../../atoms/Button';
import { ArrowIcon, CloseIcon, ContactIcon } from '../../atoms/icons';
import styles from './Contact.module.css';

export type ContactButtonVariant = 'icon' | 'labelled';

type Props = {
  variant: ContactButtonVariant;
  isOpen: boolean;
  ariaLabel: string;
  controlsId: string;
  onClick: () => void;
};

/**
 * Trigger button for the Contact section. Picks between the icon-only round
 * button (shown alongside an AvailabilityStatus) and the labelled pill
 * ("Get in touch").
 *
 * The icon-stack/arrow-slot animation lives in Contact.module.css — this
 * component just owns which shape renders and wires up the a11y.
 */
export function ContactButton({ variant, isOpen, ariaLabel, controlsId, onClick }: Props) {
  if (variant === 'icon') {
    return (
      <button
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
      </button>
    );
  }

  return (
    <Button
      type="button"
      size="lg"
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
    </Button>
  );
}

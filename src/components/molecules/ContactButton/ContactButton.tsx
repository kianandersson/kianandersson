import { ArrowIcon, CloseIcon, ContactIcon } from '../../atoms/icons';
import styles from './ContactButton.module.css';

export type ContactButtonVariant = 'icon' | 'labelled';

type Props = {
  variant: ContactButtonVariant;
  isOpen: boolean;
  ariaLabel: string;
  controlsId: string;
  onClick: () => void;
};

/**
 * Toggle button for an inline contact form. Picks between an icon-only round
 * trigger (typically shown next to an availability indicator) and a labelled
 * pill ("Get in touch"). Both variants render their own native <button> so all
 * chrome (shape, color, animation, aria-expanded state flip) is fully owned.
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
          <span class={styles.icAt}>
            <ContactIcon size={18} />
          </span>
          <span class={styles.icArrow}>
            <ArrowIcon size={17} direction="right" />
          </span>
          <span class={styles.icX}>
            <CloseIcon size={16} />
          </span>
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      class={styles.labelledButton}
      aria-expanded={isOpen}
      aria-controls={controlsId}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <span class={styles.labelText}>Get in touch</span>
      <span class={styles.arrowSlot} aria-hidden="true">
        <span class={styles.icArrow}>
          <ArrowIcon size={15} direction="right" />
        </span>
        <span class={styles.icX}>
          <CloseIcon size={15} />
        </span>
      </span>
    </button>
  );
}

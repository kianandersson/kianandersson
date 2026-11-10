import { useEffect, useId, useState } from 'preact/hooks';
import { formatDate } from '../../../lib/formatDate';
import { AvailabilityStatus } from '../../atoms/AvailabilityStatus';
import { ContactButton } from '../../molecules/ContactButton';
import { ContactForm, type ContactPayload } from '../ContactForm';
import styles from './Contact.module.css';
import { useContactSubmission } from './useContactSubmission';

export type ContactProps = {
  recipientName: string;
  availableFrom?: Date;
  /** When the HTML was rendered (build time for a prerendered page). */
  renderedAt?: number;
  onSend: (payload: ContactPayload) => Promise<{ error?: unknown }>;
};

function pickAriaLabel(open: boolean, availableFrom: Date | undefined, now: number): string {
  if (open) return 'Close contact form';
  if (!availableFrom) return 'Get in touch';
  if (availableFrom.getTime() <= now) return 'Get in touch';
  return `Get in touch — available from ${formatDate(availableFrom)}`;
}

export function Contact({ recipientName, availableFrom, renderedAt, onSend }: ContactProps) {
  const regionId = useId();
  // Hydration patches text but not attributes, so the first render must match
  // the prerendered HTML; the visitor's clock takes over after mount.
  const [now, setNow] = useState(() => renderedAt ?? Date.now());
  useEffect(() => setNow(Date.now()), []);
  const {
    open,
    formStatus,
    errorMessage,
    formKey,
    formLeaving,
    successLeaving,
    showSuccess,
    toggle,
    submit,
  } = useContactSubmission({ send: onSend });

  const showAvailability = availableFrom !== undefined;
  const ariaLabel = pickAriaLabel(open, availableFrom, now);

  return (
    <div class={styles.root} data-open={open}>
      <div class={styles.triggerRow}>
        {showAvailability && <AvailabilityStatus availableFrom={availableFrom} now={now} />}
        <ContactButton
          variant={showAvailability ? 'icon' : 'labelled'}
          isOpen={open}
          ariaLabel={ariaLabel}
          controlsId={regionId}
          onClick={toggle}
        />
      </div>

      <div id={regionId} class={styles.reveal} data-open={open} {...(!open && { inert: true })}>
        <div class={styles.inner}>
          <div
            class={styles.formWrap}
            data-active={!showSuccess}
            data-leaving={formLeaving}
            {...(showSuccess && { inert: true })}
          >
            <ContactForm
              key={formKey}
              recipientName={recipientName}
              status={formStatus}
              errorMessage={errorMessage}
              onSubmit={submit}
            />
          </div>
          {showSuccess && (
            <p class={styles.success} data-leaving={successLeaving}>
              <span class={styles.successArrow}>↳</span>
              <span class={styles.successText}>message sent — I'll be in touch soon.</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

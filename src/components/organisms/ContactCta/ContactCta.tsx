import { actions } from 'astro:actions';
import { formatDate } from '../../../lib/formatDate';
import { AvailabilityPill } from '../../atoms/AvailabilityPill';
import { ContactForm, type ContactStatus } from '../ContactForm';
import styles from './ContactCta.module.css';
import { ContactTrigger } from './ContactTrigger';
import { useContactSubmission } from './useContactSubmission';

export type ContactCtaProps = {
  recipientName: string;
  availableFrom?: Date;
};

const REGION_ID = 'contact-region';

function pickAriaLabel(open: boolean, availableFrom: Date | undefined): string {
  if (open) return 'Close contact form';
  if (!availableFrom) return 'Get in touch';
  if (availableFrom.getTime() <= Date.now()) return 'Get in touch';
  return `Get in touch — available from ${formatDate(availableFrom)}`;
}

export function ContactCta({ recipientName, availableFrom }: ContactCtaProps) {
  const { open, status, errorMessage, formKey, formLeaving, successLeaving, toggle, submit } =
    useContactSubmission({ send: actions.contact.send });

  const showAvailability = availableFrom !== undefined;
  const ariaLabel = pickAriaLabel(open, availableFrom);
  const formStatus: ContactStatus = status === 'success' ? 'idle' : status;

  return (
    <div class={styles.root} data-open={open}>
      <div class={styles.triggerRow}>
        {showAvailability && <AvailabilityPill availableFrom={availableFrom} />}
        <ContactTrigger
          variant={showAvailability ? 'icon' : 'labelled'}
          isOpen={open}
          ariaLabel={ariaLabel}
          controlsId={REGION_ID}
          onClick={toggle}
        />
      </div>

      <div id={REGION_ID} class={styles.reveal} data-open={open} {...(!open && { inert: true })}>
        <div class={styles.inner}>
          <div
            class={styles.formWrap}
            data-active={status !== 'success'}
            data-leaving={formLeaving}
            {...(status === 'success' && { inert: true })}
          >
            <ContactForm
              key={formKey}
              recipientName={recipientName}
              status={formStatus}
              errorMessage={errorMessage}
              onSubmit={submit}
            />
          </div>
          {(status === 'success' || successLeaving) && (
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

import { actions } from 'astro:actions';
import { useId } from 'preact/hooks';
import { formatDate } from '../../../lib/formatDate';
import { AvailabilityStatus } from '../../atoms/AvailabilityStatus';
import { ContactButton } from '../../molecules/ContactButton';
import { ContactForm, type ContactStatus } from '../ContactForm';
import styles from './Contact.module.css';
import { useContactSubmission } from './useContactSubmission';

export type ContactProps = {
  recipientName: string;
  availableFrom?: Date;
};

function pickAriaLabel(open: boolean, availableFrom: Date | undefined): string {
  if (open) return 'Close contact form';
  if (!availableFrom) return 'Get in touch';
  if (availableFrom.getTime() <= Date.now()) return 'Get in touch';
  return `Get in touch — available from ${formatDate(availableFrom)}`;
}

export function Contact({ recipientName, availableFrom }: ContactProps) {
  const regionId = useId();
  const { open, status, errorMessage, formKey, formLeaving, successLeaving, toggle, submit } =
    useContactSubmission({ send: actions.sendContactMessage });

  const showAvailability = availableFrom !== undefined;
  const ariaLabel = pickAriaLabel(open, availableFrom);
  const formStatus: ContactStatus = status === 'success' ? 'idle' : status;

  return (
    <div class={styles.root} data-open={open}>
      <div class={styles.triggerRow}>
        {showAvailability && <AvailabilityStatus availableFrom={availableFrom} />}
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

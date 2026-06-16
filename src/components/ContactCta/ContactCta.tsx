import { actions } from 'astro:actions';
import { useEffect, useRef, useState } from 'preact/hooks';
import { formatDate } from '../../lib/formatDate';
import { AvailabilityPill } from '../AvailabilityPill/AvailabilityPill';
import { ContactForm, type ContactPayload, type ContactStatus } from '../ContactForm/ContactForm';
import styles from './ContactCta.module.css';

export type ContactCtaProps = {
  recipientName: string;
  availableFrom?: Date;
};

type CtaStatus = ContactStatus | 'success';

const COLLAPSE_DELAY_MS = 3200;
const RESET_DELAY_MS = 560;
const FORM_LEAVE_MS = 280;
const SUCCESS_LEAVE_MS = 400;
// Cross-fade: success begins entering halfway through the form's leave animation.
const SUCCESS_ENTER_AFTER_MS = FORM_LEAVE_MS / 2;

const REGION_ID = 'contact-region';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pickAriaLabel(open: boolean, availableFrom: Date | undefined): string {
  if (open) return 'Close contact form';
  if (!availableFrom) return 'Get in touch';
  if (availableFrom.getTime() <= Date.now()) return 'Get in touch — available for work';
  return `Get in touch — available from ${formatDate(availableFrom)}`;
}

export function ContactCta({ recipientName, availableFrom }: ContactCtaProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<CtaStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [formLeaving, setFormLeaving] = useState(false);
  const [successLeaving, setSuccessLeaving] = useState(false);

  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestToken = useRef(0);

  function cancelResetTimer() {
    if (resetTimer.current != null) {
      clearTimeout(resetTimer.current);
      resetTimer.current = null;
    }
  }

  function resetState() {
    cancelResetTimer();
    requestToken.current++;
    setStatus('idle');
    setErrorMessage(null);
    setFormLeaving(false);
    setSuccessLeaving(false);
    setFormKey((value) => value + 1);
  }

  function close() {
    setOpen(false);
    if (status === 'success') {
      // Stop any in-flight auto-collapse chain, then let the success line fade out
      // before tearing it down.
      requestToken.current++;
      cancelResetTimer();
      resetTimer.current = setTimeout(resetState, RESET_DELAY_MS);
    } else {
      resetState();
    }
  }

  function toggle() {
    if (open) {
      close();
    } else {
      resetState();
      setOpen(true);
    }
  }

  async function handleSubmit(payload: ContactPayload) {
    const token = ++requestToken.current;
    setStatus('sending');
    setErrorMessage(null);

    const { error } = await actions.contact.send(payload);
    if (requestToken.current !== token) return;
    if (error) {
      setStatus('error');
      setErrorMessage("Couldn't send — please try again in a moment.");
      return;
    }

    setFormLeaving(true);
    await delay(SUCCESS_ENTER_AFTER_MS);
    if (requestToken.current !== token) return;
    setStatus('success');
    setFormLeaving(false);

    await delay(COLLAPSE_DELAY_MS);
    if (requestToken.current !== token) return;
    setSuccessLeaving(true);

    await delay(SUCCESS_LEAVE_MS);
    if (requestToken.current !== token) return;
    setOpen(false);

    await delay(RESET_DELAY_MS);
    if (requestToken.current !== token) return;
    resetState();
  }

  useEffect(
    () => () => {
      cancelResetTimer();
      requestToken.current++;
    },
    [],
  );

  const showAvailability = availableFrom !== undefined;
  const ariaLabel = pickAriaLabel(open, availableFrom);
  const formStatus: ContactStatus = status === 'success' ? 'idle' : status;

  return (
    <div class={styles.root} data-open={open}>
      <div class={styles.triggerRow}>
        {showAvailability && <AvailabilityPill availableFrom={availableFrom} />}

        {showAvailability ? (
          <button
            type="button"
            class={styles.iconButton}
            data-variant="icon"
            data-open={open}
            aria-expanded={open}
            aria-controls={REGION_ID}
            aria-label={ariaLabel}
            onClick={toggle}
          >
            <span class={styles.iconStack} aria-hidden="true">
              <AtIcon class={styles.icAt} size={18} />
              <ArrowIcon class={styles.icArrow} size={17} />
              <CloseIcon class={styles.icX} size={16} />
            </span>
          </button>
        ) : (
          <button
            type="button"
            class={styles.labelledButton}
            data-variant="labelled"
            data-open={open}
            aria-expanded={open}
            aria-controls={REGION_ID}
            aria-label={ariaLabel}
            onClick={toggle}
          >
            <span class={styles.labelText}>Get in touch</span>
            <span class={styles.arrowSlot} aria-hidden="true">
              <ArrowIcon class={styles.icArrow} size={15} />
              <CloseIcon class={styles.icX} size={15} />
            </span>
          </button>
        )}
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
              onSubmit={handleSubmit}
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

type IconProps = { class?: string; size: number };

function AtIcon({ class: className, size }: IconProps) {
  return (
    <svg
      class={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.7"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.9 7.9" />
    </svg>
  );
}

function ArrowIcon({ class: className, size }: IconProps) {
  return (
    <svg
      class={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

function CloseIcon({ class: className, size }: IconProps) {
  return (
    <svg
      class={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

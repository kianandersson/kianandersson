import { actions } from 'astro:actions';
import { useEffect, useRef, useState } from 'preact/hooks';
import { formatDate } from '../../lib/formatDate';
import { ContactForm, type ContactPayload, type ContactStatus } from '../ContactForm/ContactForm';
import styles from './ContactCta.module.css';

export type ContactCtaProps = {
  recipientName: string;
  availableFrom?: Date;
};

type Variant = 'future' | 'available' | 'none';
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

function pickVariant(availableFrom: Date | undefined): Variant {
  if (!availableFrom) return 'none';
  return availableFrom.getTime() > Date.now() ? 'future' : 'available';
}

function pickAriaLabel(open: boolean, variant: Variant, formattedDate: string | null): string {
  if (open) return 'Close contact form';
  if (variant === 'available') return 'Get in touch — available for work';
  if (variant === 'future' && formattedDate)
    return `Get in touch — available from ${formattedDate}`;
  return 'Get in touch';
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

  const variant = pickVariant(availableFrom);
  const formattedDate = availableFrom ? formatDate(availableFrom) : null;
  const ariaLabel = pickAriaLabel(open, variant, formattedDate);
  const formStatus: ContactStatus = status === 'success' ? 'idle' : status;

  return (
    <div class={styles.root} data-open={open}>
      <div class={styles.trigger} data-open={open}>
        <button
          type="button"
          class={styles.pill}
          data-availability={variant}
          data-open={open}
          aria-expanded={open}
          aria-controls={REGION_ID}
          aria-label={ariaLabel}
          onClick={toggle}
        >
          {variant === 'available' && (
            <span class={styles.dot} data-tone="ok" aria-hidden="true" />
          )}
          {variant === 'future' && (
            <span class={styles.dot} data-tone="warn" aria-hidden="true" />
          )}

          <span class={styles.label}>
            {variant === 'none' && 'Get in touch'}
            {variant === 'available' && 'Available for work'}
            {variant === 'future' && formattedDate && (
              <>
                Available from <span class={styles.date}>{formattedDate}</span>
              </>
            )}
          </span>

          <span class={styles.circle} aria-hidden="true">
            <span class={styles.iconLayer} data-icon="at">
              <AtIcon />
            </span>
            <span class={styles.iconLayer} data-icon="arrow">
              <ArrowIcon />
            </span>
            <span class={styles.iconLayer} data-icon="close">
              <CloseIcon />
            </span>
          </span>
        </button>

        {variant !== 'none' && (
          <span class={styles.tooltip} aria-hidden="true">
            Get in touch
          </span>
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

function AtIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <title>at-sign</title>
      <circle cx="12" cy="12" r="4" />
      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <title>arrow-right</title>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <title>close</title>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

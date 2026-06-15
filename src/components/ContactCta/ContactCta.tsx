import { useEffect, useRef, useState } from 'preact/hooks';
import { formatDate } from '../../lib/formatDate';
import { ContactForm, type ContactPayload, type ContactStatus } from '../ContactForm/ContactForm';
import styles from './ContactCta.module.css';

export type ContactCtaProps = {
  recipientName: string;
  availableFrom?: Date;
  endpoint?: string;
};

type CtaStatus = ContactStatus | 'success';

const COLLAPSE_DELAY_MS = 3200;
const RESET_DELAY_MS = 560;
const DEMO_DELAY_MS = 750;

const REGION_ID = 'contact-region';

export function ContactCta({ recipientName, availableFrom, endpoint }: ContactCtaProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<CtaStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestToken = useRef(0);

  function clearTimers() {
    if (collapseTimer.current != null) {
      clearTimeout(collapseTimer.current);
      collapseTimer.current = null;
    }
    if (resetTimer.current != null) {
      clearTimeout(resetTimer.current);
      resetTimer.current = null;
    }
  }

  function resetState() {
    requestToken.current++;
    setStatus('idle');
    setErrorMessage(null);
    setFormKey((value) => value + 1);
  }

  function close() {
    clearTimers();
    setOpen(false);
    if (status === 'success') {
      resetTimer.current = setTimeout(resetState, RESET_DELAY_MS);
    } else {
      resetState();
    }
  }

  function toggle() {
    if (open) {
      close();
    } else {
      clearTimers();
      resetState();
      setOpen(true);
    }
  }

  async function handleSubmit(payload: ContactPayload) {
    const token = ++requestToken.current;
    setStatus('sending');
    setErrorMessage(null);

    try {
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
      } else {
        await new Promise((resolve) => setTimeout(resolve, DEMO_DELAY_MS));
      }
      if (requestToken.current !== token) return;
      setStatus('success');
      clearTimers();
      collapseTimer.current = setTimeout(() => {
        setOpen(false);
        resetTimer.current = setTimeout(resetState, RESET_DELAY_MS);
      }, COLLAPSE_DELAY_MS);
    } catch {
      if (requestToken.current !== token) return;
      setStatus('error');
      setErrorMessage("Couldn't send — please try again in a moment.");
    }
  }

  useEffect(() => () => clearTimers(), []);

  const variant: 'future' | 'available' | 'none' = availableFrom
    ? availableFrom.getTime() > Date.now()
      ? 'future'
      : 'available'
    : 'none';

  const ariaLabel = open
    ? 'Close contact form'
    : variant === 'available'
      ? 'Get in touch — available for work'
      : variant === 'future' && availableFrom
        ? `Get in touch — available from ${formatDate(availableFrom)}`
        : 'Get in touch';

  return (
    <div class={styles.root}>
      <button
        type="button"
        class={styles.pill}
        data-variant={variant}
        data-open={open ? 'true' : 'false'}
        aria-expanded={open}
        aria-controls={REGION_ID}
        aria-label={ariaLabel}
        onClick={toggle}
      >
        {variant === 'available' && <span class={styles.dot} data-tone="ok" aria-hidden="true" />}
        {variant === 'future' && <span class={styles.dot} data-tone="warn" aria-hidden="true" />}

        <span class={styles.label}>
          {variant === 'none' && 'Get in touch'}
          {variant === 'available' && 'Available for work'}
          {variant === 'future' && availableFrom && (
            <>
              Available from <span class={styles.date}>{formatDate(availableFrom)}</span>
            </>
          )}
        </span>

        <span class={styles.circle} aria-hidden="true">
          {open ? (
            <CloseIcon />
          ) : (
            <>
              <span class={styles.iconLayer} data-icon="at">
                <AtIcon />
              </span>
              <span class={styles.iconLayer} data-icon="arrow">
                <ArrowIcon />
              </span>
            </>
          )}
        </span>

        {!open && variant !== 'none' && (
          <span class={styles.tooltip} aria-hidden="true">
            Get in touch
          </span>
        )}
      </button>

      <div
        id={REGION_ID}
        class={styles.reveal}
        data-open={open ? 'true' : 'false'}
        {...(!open ? { inert: true } : {})}
      >
        <div class={styles.inner}>
          <div class={styles.content}>
            {status === 'success' ? (
              <p class={styles.success}>↳ message sent — I'll be in touch soon.</p>
            ) : (
              <ContactForm
                key={formKey}
                recipientName={recipientName}
                status={status as ContactStatus}
                errorMessage={errorMessage}
                onSubmit={handleSubmit}
              />
            )}
          </div>
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

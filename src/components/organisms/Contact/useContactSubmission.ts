import { useEffect, useRef, useState } from 'preact/hooks';
import type { ContactPayload, ContactStatus } from '../ContactForm';

export type SubmissionStatus = ContactStatus | 'success';

type SendFn = (payload: ContactPayload) => Promise<{ error?: unknown }>;

type Options = {
  send: SendFn;
  /** Time the success line stays visible before collapsing the pill. */
  collapseDelayMs?: number;
  /** Delay after collapse before clearing internal state. */
  resetDelayMs?: number;
  /** How long the form takes to animate out before the success line enters. */
  formLeaveMs?: number;
  /** How long the success line takes to fade out. */
  successLeaveMs?: number;
  /** How long the send-icon plane stays in flight before the form leaves. */
  planeFlightMs?: number;
};

const DEFAULTS = {
  collapseDelayMs: 3200,
  resetDelayMs: 560,
  formLeaveMs: 280,
  successLeaveMs: 400,
  planeFlightMs: 500,
};

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Drives the open/close + submit/success animation lifecycle for the Contact
 * organism.
 *
 * Race-safety: every async checkpoint compares against a per-attempt token, so
 * a second submit (or a close) cancels the prior flow's pending transitions.
 */
export function useContactSubmission(options: Options) {
  const collapseDelayMs = options.collapseDelayMs ?? DEFAULTS.collapseDelayMs;
  const resetDelayMs = options.resetDelayMs ?? DEFAULTS.resetDelayMs;
  const formLeaveMs = options.formLeaveMs ?? DEFAULTS.formLeaveMs;
  const successLeaveMs = options.successLeaveMs ?? DEFAULTS.successLeaveMs;
  const planeFlightMs = options.planeFlightMs ?? DEFAULTS.planeFlightMs;
  const successEnterAfterMs = formLeaveMs / 2;

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<SubmissionStatus>('idle');
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

  function nextToken() {
    return ++requestToken.current;
  }

  function resetState() {
    cancelResetTimer();
    nextToken();
    setStatus('idle');
    setErrorMessage(null);
    setFormLeaving(false);
    setSuccessLeaving(false);
    setFormKey((value) => value + 1);
  }

  function close() {
    setOpen(false);
    if (status === 'success') {
      nextToken();
      cancelResetTimer();
      resetTimer.current = setTimeout(resetState, resetDelayMs);
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

  async function submit(payload: ContactPayload) {
    const token = nextToken();
    setStatus('sending');
    setErrorMessage(null);

    const { error } = await options.send(payload);
    if (requestToken.current !== token) return;
    if (error) {
      setStatus('error');
      setErrorMessage("Couldn't send — please try again in a moment.");
      return;
    }

    // Plane flies while the form is still visible. The form only starts to
    // leave once the flight completes.
    setStatus('sent');
    await delay(planeFlightMs);
    if (requestToken.current !== token) return;

    setFormLeaving(true);
    await delay(successEnterAfterMs);
    if (requestToken.current !== token) return;
    setStatus('success');
    setFormLeaving(false);

    await delay(collapseDelayMs);
    if (requestToken.current !== token) return;
    setSuccessLeaving(true);

    await delay(successLeaveMs);
    if (requestToken.current !== token) return;
    setOpen(false);

    await delay(resetDelayMs);
    if (requestToken.current !== token) return;
    resetState();
  }

  useEffect(
    () => () => {
      cancelResetTimer();
      nextToken();
    },
    [],
  );

  return {
    open,
    status,
    errorMessage,
    formKey,
    formLeaving,
    successLeaving,
    toggle,
    submit,
  };
}

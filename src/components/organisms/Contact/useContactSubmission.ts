import { useEffect, useRef, useState } from 'preact/hooks';
import type { ContactPayload, ContactStatus } from '../ContactForm';

export type SubmissionStatus = ContactStatus | 'success';

type SendFn = (payload: ContactPayload) => Promise<{ error?: unknown }>;

type Options = {
  send: SendFn;
};

const COLLAPSE_DELAY_MS = 3200;
const RESET_DELAY_MS = 560;
const FORM_LEAVE_MS = 280;
const SUCCESS_LEAVE_MS = 400;
const SUCCESS_ENTER_AFTER_MS = FORM_LEAVE_MS / 2;
const PLANE_FLIGHT_MS = 500;

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Drives the open/close + submit/success animation lifecycle for the Contact
 * organism.
 *
 * Race-safety: every async checkpoint compares against a per-attempt token, so
 * a second submit (or a close) cancels the prior flow's pending transitions.
 */
export function useContactSubmission(options: Options) {
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
    await delay(PLANE_FLIGHT_MS);
    if (requestToken.current !== token) return;

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

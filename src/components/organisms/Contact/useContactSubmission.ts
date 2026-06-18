import { useEffect, useReducer, useRef } from 'preact/hooks';
import type { ContactPayload, ContactStatus } from '../ContactForm';

type SendFn = (payload: ContactPayload) => Promise<{ error?: unknown }>;

type Options = {
  send: SendFn;
};

// Tracks what was on screen the moment a collapse started, so the visual
// doesn't snap mid-animation if the user closes while the success message is
// already in flight.
type CollapseSuccess = 'none' | 'shown' | 'leaving';

type Phase =
  | { kind: 'closed' }
  | { kind: 'open' }
  | { kind: 'sending' }
  | { kind: 'error'; message: string }
  | { kind: 'flying' }
  | { kind: 'leavingForm' }
  | { kind: 'success' }
  | { kind: 'leavingSuccess' }
  | { kind: 'collapsing'; success: CollapseSuccess };

type State = {
  phase: Phase;
  formKey: number;
};

type Action =
  | { type: 'open' }
  | { type: 'close' }
  | { type: 'submit' }
  | { type: 'sendFailed'; message: string }
  | { type: 'sendSucceeded' }
  | { type: 'flightEnded' }
  | { type: 'formLeaveHalfDone' }
  | { type: 'successDwellDone' }
  | { type: 'successLeaveDone' }
  | { type: 'collapseDone' };

const ERROR_MESSAGE = "Couldn't send — please try again in a moment.";

// Linked to CSS values in Contact.module.css and the plane animation in
// ContactForm. Update both sides together if either changes.
const PLANE_FLIGHT_MS = 500;
const FORM_LEAVE_MS = 280;
const SUCCESS_ENTER_AFTER_MS = FORM_LEAVE_MS / 2;
const SUCCESS_DWELL_MS = 3200;
const SUCCESS_LEAVE_MS = 400;
const COLLAPSE_MS = 560;

const INITIAL_STATE: State = { phase: { kind: 'closed' }, formKey: 0 };

function startCollapse(state: State, success: CollapseSuccess): State {
  return { ...state, phase: { kind: 'collapsing', success } };
}

function reducer(state: State, action: Action): State {
  const { phase } = state;
  switch (phase.kind) {
    case 'closed':
      if (action.type === 'open') return { ...state, phase: { kind: 'open' } };
      return state;
    case 'open':
      if (action.type === 'submit') return { ...state, phase: { kind: 'sending' } };
      if (action.type === 'close') return startCollapse(state, 'none');
      return state;
    case 'sending':
      if (action.type === 'sendSucceeded') return { ...state, phase: { kind: 'flying' } };
      if (action.type === 'sendFailed')
        return { ...state, phase: { kind: 'error', message: action.message } };
      if (action.type === 'close') return startCollapse(state, 'none');
      return state;
    case 'error':
      if (action.type === 'submit') return { ...state, phase: { kind: 'sending' } };
      if (action.type === 'close') return startCollapse(state, 'none');
      return state;
    case 'flying':
      if (action.type === 'flightEnded') return { ...state, phase: { kind: 'leavingForm' } };
      if (action.type === 'close') return startCollapse(state, 'none');
      return state;
    case 'leavingForm':
      if (action.type === 'formLeaveHalfDone') return { ...state, phase: { kind: 'success' } };
      if (action.type === 'close') return startCollapse(state, 'none');
      return state;
    case 'success':
      if (action.type === 'successDwellDone')
        return { ...state, phase: { kind: 'leavingSuccess' } };
      if (action.type === 'close') return startCollapse(state, 'shown');
      return state;
    case 'leavingSuccess':
      if (action.type === 'successLeaveDone' || action.type === 'close')
        return startCollapse(state, 'leaving');
      return state;
    case 'collapsing':
      if (action.type === 'collapseDone')
        return { phase: { kind: 'closed' }, formKey: state.formKey + 1 };
      if (action.type === 'open') return { phase: { kind: 'open' }, formKey: state.formKey + 1 };
      return state;
  }
}

function abortableDelay(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (signal.aborted) {
      resolve();
      return;
    }
    const onAbort = () => {
      clearTimeout(timer);
      resolve();
    };
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    signal.addEventListener('abort', onAbort, { once: true });
  });
}

/**
 * Drives the open/close + submit/success animation lifecycle for the Contact
 * organism as an explicit state machine.
 *
 * Race-safety: each toggle/submit starts a fresh AbortController. Pending
 * delays observe the signal and resolve early; the orchestrating coroutine
 * checks `signal.aborted` after every await and bails out without dispatching.
 */
export function useContactSubmission({ send }: Options) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const controllerRef = useRef<AbortController | null>(null);

  function restart(): AbortSignal {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    return controller.signal;
  }

  function toggle() {
    const { phase } = state;
    if (phase.kind === 'closed' || phase.kind === 'collapsing') {
      controllerRef.current?.abort();
      dispatch({ type: 'open' });
      return;
    }
    const signal = restart();
    dispatch({ type: 'close' });
    void abortableDelay(COLLAPSE_MS, signal).then(() => {
      if (signal.aborted) return;
      dispatch({ type: 'collapseDone' });
    });
  }

  async function submit(payload: ContactPayload) {
    const signal = restart();
    dispatch({ type: 'submit' });

    let result: { error?: unknown };
    try {
      result = await send(payload);
    } catch {
      if (signal.aborted) return;
      dispatch({ type: 'sendFailed', message: ERROR_MESSAGE });
      return;
    }
    if (signal.aborted) return;
    if (result.error) {
      dispatch({ type: 'sendFailed', message: ERROR_MESSAGE });
      return;
    }

    dispatch({ type: 'sendSucceeded' });
    await abortableDelay(PLANE_FLIGHT_MS, signal);
    if (signal.aborted) return;

    dispatch({ type: 'flightEnded' });
    await abortableDelay(SUCCESS_ENTER_AFTER_MS, signal);
    if (signal.aborted) return;

    dispatch({ type: 'formLeaveHalfDone' });
    await abortableDelay(SUCCESS_DWELL_MS, signal);
    if (signal.aborted) return;

    dispatch({ type: 'successDwellDone' });
    await abortableDelay(SUCCESS_LEAVE_MS, signal);
    if (signal.aborted) return;

    dispatch({ type: 'successLeaveDone' });
    await abortableDelay(COLLAPSE_MS, signal);
    if (signal.aborted) return;

    dispatch({ type: 'collapseDone' });
  }

  useEffect(() => () => controllerRef.current?.abort(), []);

  const { phase } = state;
  // `collapsing` is the close-animation phase: aria-expanded should already
  // read false (user intent) and data-open=false drives the CSS close.
  const open = phase.kind !== 'closed' && phase.kind !== 'collapsing';
  const formStatus: ContactStatus =
    phase.kind === 'sending'
      ? 'sending'
      : phase.kind === 'flying' || phase.kind === 'leavingForm'
        ? 'sent'
        : phase.kind === 'error'
          ? 'error'
          : 'idle';
  const errorMessage = phase.kind === 'error' ? phase.message : null;
  const formLeaving = phase.kind === 'leavingForm';
  const successLeaving =
    phase.kind === 'leavingSuccess' || (phase.kind === 'collapsing' && phase.success === 'leaving');
  const showSuccess =
    phase.kind === 'success' ||
    phase.kind === 'leavingSuccess' ||
    (phase.kind === 'collapsing' && phase.success !== 'none');

  return {
    open,
    formStatus,
    errorMessage,
    formKey: state.formKey,
    formLeaving,
    successLeaving,
    showSuccess,
    toggle,
    submit,
  };
}

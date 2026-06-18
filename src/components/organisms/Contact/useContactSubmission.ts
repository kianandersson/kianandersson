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
  | { type: 'toggle' }
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

function applyToggle(state: State): State {
  switch (state.phase.kind) {
    case 'closed':
      return { ...state, phase: { kind: 'open' } };
    case 'collapsing':
      return { phase: { kind: 'open' }, formKey: state.formKey + 1 };
    case 'open':
    case 'sending':
    case 'error':
    case 'flying':
    case 'leavingForm':
      return startCollapse(state, 'none');
    case 'success':
      return startCollapse(state, 'shown');
    case 'leavingSuccess':
      return startCollapse(state, 'leaving');
  }
}

function reducer(state: State, action: Action): State {
  if (action.type === 'toggle') return applyToggle(state);
  const { phase } = state;
  switch (phase.kind) {
    case 'open':
      if (action.type === 'submit') return { ...state, phase: { kind: 'sending' } };
      return state;
    case 'sending':
      if (action.type === 'sendSucceeded') return { ...state, phase: { kind: 'flying' } };
      if (action.type === 'sendFailed')
        return { ...state, phase: { kind: 'error', message: action.message } };
      return state;
    case 'error':
      if (action.type === 'submit') return { ...state, phase: { kind: 'sending' } };
      return state;
    case 'flying':
      if (action.type === 'flightEnded') return { ...state, phase: { kind: 'leavingForm' } };
      return state;
    case 'leavingForm':
      if (action.type === 'formLeaveHalfDone') return { ...state, phase: { kind: 'success' } };
      return state;
    case 'success':
      if (action.type === 'successDwellDone')
        return { ...state, phase: { kind: 'leavingSuccess' } };
      return state;
    case 'leavingSuccess':
      if (action.type === 'successLeaveDone') return startCollapse(state, 'leaving');
      return state;
    case 'collapsing':
      if (action.type === 'collapseDone')
        return { phase: { kind: 'closed' }, formKey: state.formKey + 1 };
      return state;
    default:
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
 *
 * The collapse-to-closed timer is owned by an effect on `phase.kind` instead
 * of the coroutine, so both the manual close path and the auto-flow tail end
 * up in the same place.
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
    controllerRef.current?.abort();
    dispatch({ type: 'toggle' });
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
    // Phase is now `collapsing`; the effect below schedules `collapseDone`.
  }

  useEffect(() => () => controllerRef.current?.abort(), []);

  // Owns the collapse → closed transition for both manual close and auto-flow:
  // when phase enters `collapsing`, schedule the final reset; cleanup aborts
  // it if the user re-opens mid-collapse.
  useEffect(() => {
    if (state.phase.kind !== 'collapsing') return;
    const controller = new AbortController();
    void abortableDelay(COLLAPSE_MS, controller.signal).then(() => {
      if (controller.signal.aborted) return;
      dispatch({ type: 'collapseDone' });
    });
    return () => controller.abort();
  }, [state.phase.kind]);

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

import { useState } from 'preact/hooks';
import styles from './ContactForm.module.css';

export type ContactPayload = { name: string; email: string; message: string };
export type ContactStatus = 'idle' | 'sending' | 'error';

type Props = {
  recipientName: string;
  status: ContactStatus;
  errorMessage: string | null;
  onSubmit: (payload: ContactPayload) => void;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

export function ContactForm({ recipientName, status, errorMessage, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const trimmedName = name.trim();
  const trimmedMessage = message.trim();
  const valid = trimmedName.length > 0 && EMAIL_RE.test(email.trim()) && trimmedMessage.length > 0;
  const sending = status === 'sending';

  function handleSubmit(event: Event) {
    event.preventDefault();
    if (!valid || sending) return;
    onSubmit({ name: trimmedName, email: email.trim(), message: trimmedMessage });
  }

  return (
    <form class={styles.window} aria-label="Contact" onSubmit={handleSubmit} noValidate>
      <div class={styles.titleBar}>
        <span class={`${styles.trafficDot} ${styles.dotRed}`} aria-hidden="true" />
        <span class={`${styles.trafficDot} ${styles.dotAmber}`} aria-hidden="true" />
        <span class={`${styles.trafficDot} ${styles.dotGreen}`} aria-hidden="true" />
        <span class={styles.title}>Contact</span>
      </div>

      <div class={styles.body}>
        <div class={styles.row}>
          <span class={styles.fieldLabel}>To</span>
          <span class={styles.recipient}>
            <span class={styles.recipientDot} aria-hidden="true" />
            {recipientName}
          </span>
        </div>

        <div class={`${styles.row} ${styles.inputRow}`}>
          <label class={styles.fieldLabel} for="contact-from">
            From
          </label>
          <input
            id="contact-from"
            class={styles.input}
            type="text"
            placeholder="Your name"
            autocomplete="name"
            value={name}
            onInput={(event) => setName((event.target as HTMLInputElement).value)}
            disabled={sending}
            required
          />
        </div>

        <div class={`${styles.row} ${styles.inputRow}`}>
          <label class={styles.fieldLabel} for="contact-email">
            Email
          </label>
          <input
            id="contact-email"
            class={styles.input}
            type="email"
            inputMode="email"
            placeholder="you@company.com"
            autocomplete="email"
            value={email}
            onInput={(event) => setEmail((event.target as HTMLInputElement).value)}
            disabled={sending}
            required
          />
        </div>

        <div class={`${styles.row} ${styles.messageRow}`}>
          <textarea
            id="contact-message"
            class={styles.textarea}
            placeholder="Write your message…"
            aria-label="Message"
            value={message}
            onInput={(event) => setMessage((event.target as HTMLTextAreaElement).value)}
            disabled={sending}
            required
          />
        </div>

        <div class={styles.toolbar}>
          {status === 'error' && errorMessage ? (
            <span class={styles.error} role="status">
              ↳ {errorMessage}
            </span>
          ) : null}
          <button
            type="submit"
            class={styles.send}
            data-sending={sending}
            disabled={!valid || sending}
          >
            {sending ? 'Sending…' : 'Send message'}
            <PaperPlane />
          </button>
        </div>
      </div>
    </form>
  );
}

function PaperPlane() {
  return (
    <svg
      class={styles.plane}
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <title>send</title>
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
    </svg>
  );
}

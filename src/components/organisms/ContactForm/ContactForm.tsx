import { useState } from 'preact/hooks';
import {
  CONTACT_EMAIL_REGEX,
  CONTACT_MESSAGE_MAX,
  CONTACT_SUBJECT_MAX,
} from '../../../lib/contact-validation';
import { FieldLabel } from '../../atoms/FieldLabel';
import { SendIcon } from '../../atoms/icons';
import { PillButton } from '../../atoms/PillButton';
import { Text } from '../../atoms/Text';
import { Textarea } from '../../atoms/Textarea';
import { TextInput } from '../../atoms/TextInput';
import { WindowFrame } from '../../molecules/WindowFrame';
import styles from './ContactForm.module.css';

export type ContactPayload = {
  email: string;
  subject: string;
  message: string;
};
export type ContactStatus = 'idle' | 'sending' | 'error';

type Props = {
  recipientName: string;
  status: ContactStatus;
  errorMessage: string | null;
  onSubmit: (payload: ContactPayload) => void;
};

export function ContactForm({ recipientName, status, errorMessage, onSubmit }: Props) {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const trimmedEmail = email.trim();
  const trimmedSubject = subject.trim();
  const trimmedMessage = message.trim();
  const valid =
    CONTACT_EMAIL_REGEX.test(trimmedEmail) &&
    trimmedSubject.length > 0 &&
    trimmedSubject.length <= CONTACT_SUBJECT_MAX &&
    trimmedMessage.length > 0 &&
    trimmedMessage.length <= CONTACT_MESSAGE_MAX;
  const sending = status === 'sending';

  function handleSubmit(event: Event) {
    event.preventDefault();
    if (!valid || sending) return;
    onSubmit({
      email: trimmedEmail,
      subject: trimmedSubject,
      message: trimmedMessage,
    });
  }

  return (
    <form aria-label="Contact" onSubmit={handleSubmit} noValidate>
      <WindowFrame>
        <div class={styles.body}>
          <div class={styles.row}>
            <Text font="mono" size="label" tone="subtle" class={styles.fieldLabel}>
              To
            </Text>
            <span class={styles.recipient}>
              <span class={styles.recipientDot} aria-hidden="true" />
              {recipientName}
            </span>
          </div>

          <div class={`${styles.row} ${styles.inputRow}`}>
            <FieldLabel for="contact-from" class={styles.fieldLabel}>
              From
            </FieldLabel>
            <TextInput
              id="contact-from"
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

          <div class={`${styles.row} ${styles.inputRow}`}>
            <FieldLabel for="contact-subject" class={styles.fieldLabel}>
              Subject
            </FieldLabel>
            <TextInput
              id="contact-subject"
              type="text"
              placeholder="What's on your mind?"
              autocomplete="off"
              value={subject}
              onInput={(event) => setSubject((event.target as HTMLInputElement).value)}
              disabled={sending}
              maxLength={CONTACT_SUBJECT_MAX}
              required
            />
          </div>

          <div class={`${styles.row} ${styles.messageRow}`}>
            <Textarea
              id="contact-message"
              placeholder="Write your message…"
              aria-label="Message"
              value={message}
              onInput={(event) => setMessage((event.target as HTMLTextAreaElement).value)}
              disabled={sending}
              maxLength={CONTACT_MESSAGE_MAX}
              required
            />
          </div>

          <div class={styles.toolbar}>
            {status === 'error' && errorMessage ? (
              <Text font="mono" size="caption-s" tone="muted" role="status" class={styles.error}>
                ↳ {errorMessage}
              </Text>
            ) : null}
            <PillButton
              type="submit"
              size="md"
              disabled={!valid || sending}
              class={sending ? `${styles.send} ${styles.sending}` : styles.send}
            >
              {sending ? 'Sending…' : 'Send message'}
              <SendIcon class={styles.plane} />
            </PillButton>
          </div>
        </div>
      </WindowFrame>
    </form>
  );
}

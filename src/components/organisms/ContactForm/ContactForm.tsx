import { useId, useState } from 'preact/hooks';
import {
  CONTACT_EMAIL_REGEX,
  CONTACT_MESSAGE_MAX,
  CONTACT_SUBJECT_MAX,
} from '../../../lib/contact-validation';
import { Button } from '../../atoms/Button';
import { FieldLabel } from '../../atoms/FieldLabel';
import { SendIcon } from '../../atoms/icons';
import { Text } from '../../atoms/Text';
import { Textarea } from '../../atoms/Textarea';
import { TextInput } from '../../atoms/TextInput';
import { Window } from '../../molecules/Window';
import styles from './ContactForm.module.css';

export type ContactPayload = {
  email: string;
  subject: string;
  message: string;
};
export type ContactStatus = 'idle' | 'sending' | 'sent' | 'error';

type Props = {
  recipientName: string;
  status: ContactStatus;
  errorMessage: string | null;
  onSubmit: (payload: ContactPayload) => void;
};

export function ContactForm({ recipientName, status, errorMessage, onSubmit }: Props) {
  const emailId = useId();
  const subjectId = useId();
  const messageId = useId();
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
  const sent = status === 'sent';
  const locked = sending || sent;

  function handleSubmit(event: Event) {
    event.preventDefault();
    if (!valid || locked) return;
    onSubmit({
      email: trimmedEmail,
      subject: trimmedSubject,
      message: trimmedMessage,
    });
  }

  return (
    <form aria-label="Contact" onSubmit={handleSubmit} noValidate>
      <Window>
        <div class={styles.body}>
          <div class={styles.row}>
            <span class={styles.fieldLabel}>
              <FieldLabel for={emailId}>To</FieldLabel>
            </span>
            <span class={styles.recipient}>
              <span class={styles.recipientDot} aria-hidden="true" />
              {recipientName}
            </span>
          </div>

          <div class={`${styles.row} ${styles.inputRow}`}>
            <span class={styles.fieldLabel}>
              <FieldLabel for={emailId}>From</FieldLabel>
            </span>
            <TextInput
              id={emailId}
              type="email"
              inputMode="email"
              placeholder="you@company.com"
              autocomplete="email"
              value={email}
              onInput={(event) => setEmail((event.target as HTMLInputElement).value)}
              disabled={locked}
              required
            />
          </div>

          <div class={`${styles.row} ${styles.inputRow}`}>
            <span class={styles.fieldLabel}>
              <FieldLabel for={subjectId}>Subject</FieldLabel>
            </span>
            <TextInput
              id={subjectId}
              type="text"
              placeholder="What's on your mind?"
              autocomplete="off"
              value={subject}
              onInput={(event) => setSubject((event.target as HTMLInputElement).value)}
              disabled={locked}
              maxLength={CONTACT_SUBJECT_MAX}
              required
            />
          </div>

          <div class={`${styles.row} ${styles.messageRow}`}>
            <Textarea
              id={messageId}
              placeholder="Write your message…"
              aria-label="Message"
              value={message}
              onInput={(event) => setMessage((event.target as HTMLTextAreaElement).value)}
              disabled={locked}
              maxLength={CONTACT_MESSAGE_MAX}
              required
            />
          </div>

          <div class={styles.toolbar}>
            {status === 'error' && errorMessage ? (
              <span class={styles.error} role="status">
                <Text font="mono" size="caption-s" tone="muted">
                  ↳ {errorMessage}
                </Text>
              </span>
            ) : null}
            <span class={sent ? `${styles.send} ${styles.flying}` : styles.send}>
              <Button type="submit" disabled={!valid || locked}>
                {locked ? 'Sending…' : 'Send message'}
                <span class={styles.plane} aria-hidden="true">
                  <SendIcon />
                </span>
              </Button>
            </span>
          </div>
        </div>
      </Window>
    </form>
  );
}

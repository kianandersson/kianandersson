import { useId } from 'preact/hooks';
import { ChevronIcon } from '../../atoms/icons';
import { Text } from '../../atoms/Text';
import styles from './ExperienceDescription.module.css';

// Collapsed preview height, in body lines. Kept small so a long multi-paragraph
// description shows a taste and expands on demand. Print ignores the clamp.
const COLLAPSED_LINES = 4;

// Approximate character budget for one line of the ~560px body column at 16px
// sans. Only used to decide whether a description is long enough to warrant the
// toggle at all — the visual cut itself is exact (CSS max-height). Deliberately
// generous so only clearly-overflowing entries collapse.
const CHARS_PER_LINE = 66;

type Props = {
  /** Description text; blank lines (a `\n\n` break) separate paragraphs. */
  text: string;
};

function toParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function estimateLines(paragraphs: string[]): number {
  return paragraphs.reduce(
    (lines, paragraph) => lines + Math.max(1, Math.ceil(paragraph.length / CHARS_PER_LINE)),
    0,
  );
}

export function ExperienceDescription({ text }: Props) {
  const paragraphs = toParagraphs(text);
  const toggleId = useId();
  const bodyId = useId();

  // Offer the toggle only when at least a couple of lines would be hidden;
  // otherwise the clamp cuts nothing and the control would be dead weight.
  const clampable = estimateLines(paragraphs) > COLLAPSED_LINES + 1;

  const body = (
    <div
      id={bodyId}
      className={clampable ? `${styles.body} ${styles.clamped}` : styles.body}
      style={{ '--collapsed-lines': COLLAPSED_LINES }}
    >
      {paragraphs.map((paragraph) => (
        <Text key={paragraph} as="p" size="body" tone="muted">
          {paragraph}
        </Text>
      ))}
    </div>
  );

  if (!clampable) {
    return <div className={styles.root}>{body}</div>;
  }

  // Pure-CSS disclosure: a visually-hidden checkbox drives the clamp via a
  // sibling selector, so expand/collapse needs no JS and works before (and
  // without) hydration. The label reuses the checkbox's toggling for free.
  return (
    <div className={styles.root}>
      <input type="checkbox" id={toggleId} className={styles.check} aria-controls={bodyId} />
      {body}
      <label className={styles.toggle} for={toggleId}>
        <span className={styles.more}>Read more</span>
        <span className={styles.less}>Read less</span>
        <span className={styles.chevron} aria-hidden="true">
          <ChevronIcon direction="down" size={14} />
        </span>
      </label>
    </div>
  );
}

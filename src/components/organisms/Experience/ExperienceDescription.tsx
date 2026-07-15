import { useId } from 'preact/hooks';
import { ChevronIcon } from '../../atoms/icons';
import { Text } from '../../atoms/Text';
import styles from './ExperienceDescription.module.css';

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

export function ExperienceDescription({ text }: Props) {
  const [lead, ...rest] = toParagraphs(text);
  const toggleId = useId();
  const bodyId = useId();

  // Collapse at the section boundary: the preview shows the first paragraph and
  // the rest expand on demand. Only worth a toggle when there's more to reveal.
  const clampable = rest.length > 0;

  // The ellipsis and the `rest` wrapper are our own elements — we never reach
  // into the Text children to hide or decorate them from here.
  const body = (
    <div id={bodyId} className={styles.body}>
      <Text as="p" size="body" tone="muted">
        {lead}
        {clampable && (
          <span className={styles.ellipsis} aria-hidden="true">
            ..
          </span>
        )}
      </Text>
      {clampable && (
        <div className={styles.rest}>
          {rest.map((paragraph) => (
            <Text key={paragraph} as="p" size="body" tone="muted">
              {paragraph}
            </Text>
          ))}
        </div>
      )}
    </div>
  );

  if (!clampable) {
    return <div className={styles.root}>{body}</div>;
  }

  // Pure-CSS disclosure: a visually-hidden checkbox drives the collapse via a
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

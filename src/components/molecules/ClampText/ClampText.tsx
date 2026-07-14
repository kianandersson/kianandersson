import styles from './ClampText.module.css';

type Props = {
  text: string;
  /** Unique id for the disclosure control (e.g. the project id). */
  id: string;
  /** Chars above which the text collapses behind a toggle on web. */
  clampThreshold?: number;
};

// Long descriptions collapse to a few lines on web and expand via a CSS-only
// disclosure (no JS). Print and the DOM always hold the full text; length is a
// good enough proxy for "too long" and keeps this island free of extra JS.
const DEFAULT_THRESHOLD = 180;

export function ClampText({ text, id, clampThreshold = DEFAULT_THRESHOLD }: Props) {
  if (text.length <= clampThreshold) {
    return <p className={styles.text}>{text}</p>;
  }

  const toggleId = `${id}-clamp`;
  return (
    <div className={styles.root}>
      <input type="checkbox" id={toggleId} className={styles.input} />
      <p className={`${styles.text} ${styles.clamped}`}>{text}</p>
      <label htmlFor={toggleId} className={styles.toggle}>
        <span className={styles.more}>Show more</span>
        <span className={styles.less}>Show less</span>
      </label>
    </div>
  );
}

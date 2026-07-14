import { sliceList } from '../../../lib/chip-list';
import { Chip, type ChipVariant } from '../../atoms/Chip';
import styles from './ChipList.module.css';

type Props = {
  label: string;
  items: string[];
  maxChars: number;
  perItemCost?: number;
  minItems?: number;
  variant: ChipVariant;
  printMaxChars?: number;
  printPerItemCost?: number;
  expand?: boolean;
  /** Unique id for the CSS-only expand control. */
  id: string;
};

// Leading non-breaking space (with nowrap) keeps "+N more" off its own line.
const MORE_PREFIX = ' ';

export function ChipList({
  label,
  items,
  maxChars,
  perItemCost,
  variant,
  minItems,
  printMaxChars,
  printPerItemCost,
  expand = false,
  id,
}: Props) {
  const { visible, hidden, hasMore, hiddenCount } = sliceList(items, {
    maxChars,
    perItemCost,
    minItems,
  });
  const printSlice = sliceList(items, {
    maxChars: printMaxChars ?? maxChars,
    perItemCost: printPerItemCost ?? perItemCost,
    minItems,
  });
  const printItems = expand ? items : printSlice.visible;
  const printHiddenCount = expand ? 0 : printSlice.hiddenCount;
  const toggleId = `${id}-more`;

  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      {hasMore && <input type="checkbox" id={toggleId} className={styles.input} />}
      <div className={styles.chips}>
        {visible.map((item) => (
          <Chip key={item} label={item} variant={variant} />
        ))}
        {hasMore && (
          <span className={styles.overflow}>
            {hidden.map((item) => (
              <Chip key={item} label={item} variant={variant} />
            ))}
          </span>
        )}
        {hasMore && (
          <label htmlFor={toggleId} className={styles.toggle}>
            <span className={styles.more}>{`+${hiddenCount} more`}</span>
            <span className={styles.less}>Show less</span>
          </label>
        )}
      </div>
      <p className={styles.printList} data-variant={variant} aria-hidden="true">
        {printItems.join(', ')}
        {printHiddenCount > 0 && (
          <span className={styles.printMore}>{`${MORE_PREFIX}+${printHiddenCount} more`}</span>
        )}
      </p>
    </div>
  );
}

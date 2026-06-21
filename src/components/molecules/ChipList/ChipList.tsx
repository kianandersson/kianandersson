import { useCallback, useState } from 'preact/hooks';
import { sliceList } from '../../../lib/chip-list';
import { Chip, type ChipVariant } from '../../atoms/Chip';
import { TextLink } from '../../atoms/TextLink';
import styles from './ChipList.module.css';

type Props = {
  label: string;
  items: string[];
  maxChars: number;
  perItemCost?: number;
  minItems?: number;
  variant: ChipVariant;
  /** Print slice budget — paper has a wider column and smaller type, so it fits
   *  more than the web view. Defaults to the web `maxChars`. */
  printMaxChars?: number;
  /** Per-item cost for the print slice (plain ", " separator, no chip padding).
   *  Defaults to the web `perItemCost`. */
  printPerItemCost?: number;
  /** Print build only: render the whole list instead of the truncated preview. */
  expand?: boolean;
};

// Non-breaking space so "+N more" stays glued to the last skill (with nowrap it
// can never start a line on its own).
const MORE_PREFIX = ' ';

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
}: Props) {
  const [isOpen, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  // Two renders, one per medium, each sliced for its own column: the interactive
  // chips drive the web view; print gets a plain comma-separated line. Print
  // fits more per line, so it uses its own (larger) budget. When expanded the
  // print line shows everything; otherwise its own preview plus a static
  // "+N more" so a short list still signals breadth.
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

  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <div className={styles.chips}>
        {visible.map((item) => (
          <Chip key={item} label={item} variant={variant} />
        ))}
        {hasMore && (
          <span className={styles.overflow} data-shown={isOpen}>
            {hidden.map((item) => (
              <Chip key={item} label={item} variant={variant} />
            ))}
          </span>
        )}
        {hasMore && (
          <TextLink type="button" onClick={toggle} aria-expanded={isOpen}>
            {isOpen ? 'Show less' : `+${hiddenCount} more`}
          </TextLink>
        )}
      </div>
      {/* No comma before the count — it's a meta note, not another skill. */}
      <p className={styles.printList} data-variant={variant} aria-hidden="true">
        {printItems.join(', ')}
        {printHiddenCount > 0 && (
          <span className={styles.printMore}>{`${MORE_PREFIX}+${printHiddenCount} more`}</span>
        )}
      </p>
    </div>
  );
}

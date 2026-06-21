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
  printMaxChars?: number;
  printPerItemCost?: number;
  expand?: boolean;
};

// Leading non-breaking space (with nowrap) keeps "+N more" off its own line.
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
      <p className={styles.printList} data-variant={variant} aria-hidden="true">
        {printItems.join(', ')}
        {printHiddenCount > 0 && (
          <span className={styles.printMore}>{`${MORE_PREFIX}+${printHiddenCount} more`}</span>
        )}
      </p>
    </div>
  );
}

import { useCallback, useState } from 'react';
import { sliceList } from '../../../lib/chip-list';
import { Chip, type ChipVariant } from '../../atoms/Chip/Chip';
import styles from './ChipList.module.css';

type Props = {
  label: string;
  items: string[];
  limit: number;
  variant: ChipVariant;
};

export function ChipList({ label, items, limit, variant }: Props) {
  const [isOpen, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((prev) => !prev), []);
  const { visible, hidden, hasMore, hiddenCount } = sliceList(items, limit);

  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <div className={styles.chips}>
        {visible.map((item) => (
          <Chip key={item} label={item} variant={variant} />
        ))}
        {hidden.map((item) => (
          <Chip key={item} label={item} variant={variant} isHidden={!isOpen} />
        ))}
        {hasMore && (
          <button type="button" onClick={toggle} aria-expanded={isOpen} className={styles.toggle}>
            {isOpen ? 'Show less' : `+${hiddenCount} more`}
          </button>
        )}
      </div>
    </div>
  );
}

import styles from './Chip.module.css';

export type ChipVariant = 'stack' | 'domains';

type Props = {
  label: string;
  variant: ChipVariant;
};

export function Chip({ label, variant }: Props) {
  return (
    <span className={styles.chip} data-variant={variant}>
      {label}
    </span>
  );
}

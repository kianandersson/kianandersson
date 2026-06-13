import styles from './Chip.module.css';

export type ChipVariant = 'stack' | 'methods';

type Props = {
  label: string;
  variant: ChipVariant;
  isHidden?: boolean;
};

export function Chip({ label, variant, isHidden }: Props) {
  return (
    <span
      className={styles.chip}
      data-variant={variant}
      {...(isHidden && { 'data-hidden': 'true' })}
    >
      {label}
    </span>
  );
}

import type { Language } from '../../../lib/language';
import { FieldLabel } from '../../atoms/FieldLabel';
import { Text } from '../../atoms/Text';
import { SectionHeader } from '../../molecules/SectionHeader';
import styles from './Miscellaneous.module.css';

export type { Language };

type Props = {
  languages: Language[];
};

export function Miscellaneous({ languages }: Props) {
  return (
    <div className={styles.root}>
      <SectionHeader title="Miscellaneous" id="miscellaneous-heading" />
      <div className={styles.row}>
        <FieldLabel tone="muted" class={styles.rowLabel}>
          Languages
        </FieldLabel>
        <ul className={styles.chips}>
          {languages.map((lang) => (
            <li key={lang.name} className={styles.chip}>
              <Text font="sans" size="caption-m" weight="medium">
                {lang.name}
              </Text>
              <Text font="mono" size="caption-s" tone="muted">
                {lang.level}
              </Text>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

import { useId } from 'preact/hooks';
import type { Language } from '../../../lib/language';
import { Text } from '../../atoms/Text';
import { SectionHeader } from '../../molecules/SectionHeader';
import styles from './Miscellaneous.module.css';

export type { Language };

type Props = {
  languages: Language[];
};

export function Miscellaneous({ languages }: Props) {
  const languagesLabelId = useId();
  return (
    <div className={styles.root}>
      <SectionHeader title="Miscellaneous" id="miscellaneous-heading" />
      <div className={styles.row}>
        <span class={styles.rowLabel}>
          <Text font="mono" size="label" tone="muted" id={languagesLabelId}>
            Languages
          </Text>
        </span>
        <ul className={styles.chips} aria-labelledby={languagesLabelId}>
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

import { useId } from 'preact/hooks';
import { type Language, languageLevelLabel, languageNameLabel } from '../../../lib/language';
import type { Locale } from '../../../lib/locale';
import { MESSAGES } from '../../../lib/messages';
import { Text } from '../../atoms/Text';
import { SectionHeader } from '../../molecules/SectionHeader';
import styles from './Miscellaneous.module.css';

export type { Language };

type Props = {
  languages: Language[];
  locale?: Locale;
};

export function Miscellaneous({ languages, locale = 'en' }: Props) {
  const messages = MESSAGES[locale];
  const languagesLabelId = useId();
  return (
    <div className={styles.root}>
      <SectionHeader title={messages.miscellaneousTitle} id="miscellaneous-heading" />
      <div className={styles.row}>
        <span class={styles.rowLabel}>
          <Text font="mono" size="label" tone="muted" id={languagesLabelId}>
            {messages.languagesLabel}
          </Text>
        </span>
        <ul className={styles.chips} aria-labelledby={languagesLabelId}>
          {languages.map((lang) => (
            <li key={lang.name} className={styles.chip}>
              <Text font="sans" size="caption-m" weight="medium">
                {languageNameLabel(lang.name, locale)}
              </Text>
              <Text font="mono" size="caption-s" tone="muted">
                {languageLevelLabel(lang.level, locale)}
              </Text>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

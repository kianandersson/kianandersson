import type { Locale } from '../../../lib/locale';
import { MESSAGES } from '../../../lib/messages';
import type { SkillLevel } from '../../../lib/skill';
import { TextLink } from '../../atoms/TextLink';
import { SectionHeader } from '../../molecules/SectionHeader';
import { SkillRow } from '../../molecules/SkillRow';
import styles from './KeySkills.module.css';

export type KeySkill = {
  id: string;
  name: string;
  level: SkillLevel;
  years: number;
};

type Props = {
  skills: KeySkill[];
  /** Destination for the "All skills" link in the section header. Required
   *  so the component doesn't bake a concrete anchor target into itself. */
  allSkillsHref: string;
  locale?: Locale;
};

export function KeySkills({ skills, allSkillsHref, locale = 'en' }: Props) {
  const messages = MESSAGES[locale];
  return (
    <div className={styles.root}>
      <SectionHeader
        title={messages.keySkillsTitle}
        id="key-skills-heading"
        action={
          <span class={styles.allSkillsLink}>
            <TextLink href={allSkillsHref}>{messages.allSkillsLink}</TextLink>
          </span>
        }
      />
      <ul className={styles.list}>
        {skills.map((skill) => (
          <li key={skill.id} className={styles.item}>
            <SkillRow name={skill.name} level={skill.level} years={skill.years} locale={locale} />
          </li>
        ))}
      </ul>
    </div>
  );
}

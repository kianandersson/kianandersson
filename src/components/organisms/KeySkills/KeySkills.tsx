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
};

export function KeySkills({ skills }: Props) {
  return (
    <div className={styles.root}>
      <SectionHeader
        title="Key skills"
        id="key-skills-heading"
        action={
          <span class={styles.allSkillsLink}>
            <TextLink href="#skills">All skills →</TextLink>
          </span>
        }
      />
      <ul className={styles.list}>
        {skills.map((skill) => (
          <li key={skill.id} className={styles.item}>
            <SkillRow name={skill.name} level={skill.level} years={skill.years} />
          </li>
        ))}
      </ul>
    </div>
  );
}

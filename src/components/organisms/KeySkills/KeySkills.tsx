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
          <TextLink href="#skills" class={styles.allSkillsLink}>
            All skills →
          </TextLink>
        }
      />
      <ul className={styles.list}>
        {skills.map((skill) => (
          <SkillRow key={skill.id} name={skill.name} level={skill.level} years={skill.years} />
        ))}
      </ul>
    </div>
  );
}

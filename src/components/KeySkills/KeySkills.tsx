import type { SkillLevel } from '../../lib/skill';
import { SkillRow } from '../SkillRow/SkillRow';
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
    <section className={styles.section} aria-labelledby="key-skills-heading">
      <header className={styles.header}>
        <span className={styles.hash} aria-hidden="true">
          ##
        </span>
        <h2 id="key-skills-heading" className={styles.heading}>
          Key skills
        </h2>
      </header>
      <ul className={styles.list}>
        {skills.map((skill) => (
          <SkillRow key={skill.id} name={skill.name} level={skill.level} years={skill.years} />
        ))}
      </ul>
    </section>
  );
}

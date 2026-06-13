import { useState } from 'react';
import type { SkillLevel } from '../../lib/skill';
import { Accordion } from '../Accordion/Accordion';
import { SkillRow } from '../SkillRow/SkillRow';
import styles from './SkillGroups.module.css';

export type GroupedSkill = {
  id: string;
  name: string;
  level: SkillLevel;
  years: number;
};

export type SkillGroup = {
  group: string;
  skills: GroupedSkill[];
};

type Props = {
  groups: SkillGroup[];
};

export function SkillGroups({ groups }: Props) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <span className={styles.hash} aria-hidden="true">
          ##
        </span>
        <h2 id="skills-heading" className={styles.heading}>
          Skills
        </h2>
      </header>
      <div className={styles.groups}>
        {groups.map((group) => (
          <div key={group.group} className={styles.groupSlot}>
            <Accordion
              title={group.group}
              count={group.skills.length}
              isOpen={openGroup === group.group}
              onToggle={() => setOpenGroup((prev) => (prev === group.group ? null : group.group))}
            >
              <ul className={styles.list}>
                {group.skills.map((skill) => (
                  <SkillRow
                    key={skill.id}
                    name={skill.name}
                    level={skill.level}
                    years={skill.years}
                  />
                ))}
              </ul>
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  );
}

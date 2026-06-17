import { useState } from 'preact/hooks';
import type { SkillLevel } from '../../../lib/skill';
import { Accordion } from '../../molecules/Accordion';
import { SectionHeader } from '../../molecules/SectionHeader';
import { SkillRow } from '../../molecules/SkillRow';
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
      <SectionHeader title="Skills" id="skills-heading" />
      <div className={styles.groups}>
        {groups.map((group) => (
          <Accordion
            key={group.group}
            title={group.group}
            count={group.skills.length}
            isOpen={openGroup === group.group}
            onToggle={() => setOpenGroup((prev) => (prev === group.group ? null : group.group))}
          >
            <ul className={styles.list}>
              {group.skills.map((skill) => (
                <li key={skill.id} className={styles.item}>
                  <SkillRow name={skill.name} level={skill.level} years={skill.years} />
                </li>
              ))}
            </ul>
          </Accordion>
        ))}
      </div>
    </div>
  );
}

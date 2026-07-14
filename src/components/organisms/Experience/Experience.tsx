import { Heading } from '../../atoms/Heading';
import { Text } from '../../atoms/Text';
import { TimelineMarker } from '../../atoms/TimelineMarker';
import { ProjectBranch, type ProjectBranchItem } from '../../molecules/ProjectBranch';
import { SectionHeader } from '../../molecules/SectionHeader';
import { SkillChipGroups } from '../../molecules/SkillChipGroups';
import styles from './Experience.module.css';

export type ExperienceProject = ProjectBranchItem;

export type ExperienceEntry = {
  id: string;
  /** Company name — rendered as the entry heading. */
  meta: string;
  /** Role — rendered under the company. Absent when the entry has projects. */
  role?: string;
  period: string;
  description: string;
  /** Shown only when the entry has no projects; otherwise the detail lives per-project. */
  stack: string[];
  domains: string[];
  projects?: ExperienceProject[];
};

type Props = {
  entries: ExperienceEntry[];
  /** Print build only: render each role's full stack / domains list (see ChipList). */
  allStackSkills?: boolean;
  allDomainSkills?: boolean;
};

export function Experience({ entries, allStackSkills = false, allDomainSkills = false }: Props) {
  return (
    <div className={styles.root}>
      <SectionHeader title="Experience" id="experience-heading" />
      <div className={styles.timeline}>
        <span className={styles.rail} aria-hidden="true" />
        <ol className={styles.list}>
          {entries.map((entry) => (
            <li key={entry.id} className={styles.entry}>
              <TimelineMarker />
              <div className={styles.titleBlock}>
                <Heading level={3} size="s">
                  {entry.meta}
                </Heading>
                <div className={styles.metaLine}>
                  {entry.role && (
                    <>
                      <Text font="mono" size="caption-s" tone="muted">
                        {entry.role}
                      </Text>
                      <Text font="mono" size="caption-s" tone="muted" aria-hidden={true}>
                        ·
                      </Text>
                    </>
                  )}
                  <Text font="mono" size="caption-s" tone="muted">
                    {entry.period}
                  </Text>
                </div>
              </div>
              <div class={styles.description}>
                <Text as="p" size="body" tone="muted">
                  {entry.description}
                </Text>
              </div>
              {entry.projects && entry.projects.length > 0 ? (
                <ProjectBranch
                  projects={entry.projects}
                  allStackSkills={allStackSkills}
                  allDomainSkills={allDomainSkills}
                />
              ) : (
                <SkillChipGroups
                  idPrefix={entry.id}
                  stack={entry.stack}
                  domains={entry.domains}
                  allStackSkills={allStackSkills}
                  allDomainSkills={allDomainSkills}
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

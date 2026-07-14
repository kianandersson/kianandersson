import { BranchConnector } from '../../atoms/BranchConnector';
import { Heading } from '../../atoms/Heading';
import { Text } from '../../atoms/Text';
import { TimelineMarker } from '../../atoms/TimelineMarker';
import { ClampText } from '../ClampText';
import { SkillChipGroups } from '../SkillChipGroups';
import styles from './ProjectBranch.module.css';

export type ProjectBranchItem = {
  id: string;
  title: string;
  role: string;
  description: string;
  stack: string[];
  domains: string[];
};

type Props = {
  projects: ProjectBranchItem[];
  /** Print build only: expand each project's stack / domains list in full. */
  allStackSkills?: boolean;
  allDomainSkills?: boolean;
};

// Projects branch off an engagement like a git branch: a fork connector leaves
// the main rail, the projects sit on their own sub-rail, and a merge connector
// returns to the main rail.
export function ProjectBranch({
  projects,
  allStackSkills = false,
  allDomainSkills = false,
}: Props) {
  return (
    <div className={styles.branch}>
      <span className={styles.fork}>
        <BranchConnector direction="fork" />
      </span>
      <div className={styles.track}>
        <span className={styles.rail} aria-hidden="true" />
        <ol className={styles.list}>
          {projects.map((project) => (
            <li key={project.id} className={styles.project}>
              <TimelineMarker tone="muted" />
              <div className={styles.header}>
                <Heading level={4} size="s">
                  {project.title}
                </Heading>
                <Text as="div" font="mono" size="caption-s" tone="muted">
                  {project.role}
                </Text>
              </div>
              <ClampText id={project.id} text={project.description} />
              <SkillChipGroups
                idPrefix={project.id}
                stack={project.stack}
                domains={project.domains}
                allStackSkills={allStackSkills}
                allDomainSkills={allDomainSkills}
              />
            </li>
          ))}
        </ol>
      </div>
      <div className={styles.mergeSpace}>
        <span className={styles.merge}>
          <BranchConnector direction="merge" />
        </span>
      </div>
    </div>
  );
}

import { ChipList } from '../ChipList/ChipList';
import { TimelineMarker } from '../TimelineMarker/TimelineMarker';
import styles from './Experience.module.css';

const CHIP_LIMIT = 6;

export type ExperienceEntry = {
  id: string;
  role: string;
  meta: string;
  period: string;
  description: string;
  stack: string[];
  methods: string[];
};

type Props = {
  entries: ExperienceEntry[];
};

export function Experience({ entries }: Props) {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <span className={styles.hash} aria-hidden="true">
          ##
        </span>
        <h2 id="experience-heading" className={styles.heading}>
          Experience
        </h2>
      </header>
      <div className={styles.timeline}>
        <span className={styles.rail} aria-hidden="true" />
        <ol className={styles.list}>
          {entries.map((entry) => (
            <li key={entry.id} className={styles.entry}>
              <TimelineMarker />
              <div className={styles.titleBlock}>
                <h3 className={styles.role}>{entry.role}</h3>
                <div className={styles.metaLine}>
                  <span className={styles.meta}>{entry.meta}</span>
                  <span aria-hidden="true" className={styles.separator}>
                    ·
                  </span>
                  <span className={styles.period}>{entry.period}</span>
                </div>
              </div>
              <p className={styles.description}>{entry.description}</p>
              <div className={styles.chipGroups}>
                <ChipList label="Stack" items={entry.stack} limit={CHIP_LIMIT} variant="stack" />
                <ChipList
                  label="Methods"
                  items={entry.methods}
                  limit={CHIP_LIMIT}
                  variant="methods"
                />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

import { Heading } from '../../atoms/Heading';
import { Text } from '../../atoms/Text';
import { TimelineMarker } from '../../atoms/TimelineMarker';
import { ChipList } from '../../molecules/ChipList';
import { SectionHeader } from '../../molecules/SectionHeader';
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
      <SectionHeader title="Experience" id="experience-heading" />
      <div className={styles.timeline}>
        <span className={styles.rail} aria-hidden="true" />
        <ol className={styles.list}>
          {entries.map((entry) => (
            <li key={entry.id} className={styles.entry}>
              <TimelineMarker />
              <div className={styles.titleBlock}>
                <Heading level={3} size="s">
                  {entry.role}
                </Heading>
                <div className={styles.metaLine}>
                  <Text font="mono" size="caption-s" tone="muted">
                    {entry.meta}
                  </Text>
                  <Text font="mono" size="caption-s" tone="muted" aria-hidden={true}>
                    ·
                  </Text>
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

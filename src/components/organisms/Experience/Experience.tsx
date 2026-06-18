import { Heading } from '../../atoms/Heading';
import { Text } from '../../atoms/Text';
import { TimelineMarker } from '../../atoms/TimelineMarker';
import { ChipList } from '../../molecules/ChipList';
import { SectionHeader } from '../../molecules/SectionHeader';
import styles from './Experience.module.css';

// Desktop chip area ~556px (700 container − 48 padding − 24 timeline − 56 label − 16 gap).
// Geist Mono 12px ≈ 7.2px/char. Chip padding+gap ≈ 5 chars; "+N more" reserves ≈ 11 chars.
// 1 line ≈ 77 chars → 66 budget; 2 lines ≈ 154 chars → 130 budget (wrap-safe).
const CHIP_PER_ITEM_COST = 5;
const STACK_MAX_CHARS = 66;
const STACK_MIN_ITEMS = 3;
const METHODS_MAX_CHARS = 130;
const METHODS_MIN_ITEMS = 3;

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
                <ChipList
                  label="Stack"
                  items={entry.stack}
                  maxChars={STACK_MAX_CHARS}
                  perItemCost={CHIP_PER_ITEM_COST}
                  minItems={STACK_MIN_ITEMS}
                  variant="stack"
                />
                <ChipList
                  label="Methods"
                  items={entry.methods}
                  maxChars={METHODS_MAX_CHARS}
                  perItemCost={CHIP_PER_ITEM_COST}
                  minItems={METHODS_MIN_ITEMS}
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

import { Heading } from '../../atoms/Heading';
import { Text } from '../../atoms/Text';
import { TimelineMarker } from '../../atoms/TimelineMarker';
import { ChipList } from '../../molecules/ChipList';
import { SectionHeader } from '../../molecules/SectionHeader';
import styles from './Experience.module.css';

// Desktop chip area ~556px (700 container − 48 padding − 24 timeline − 56 label − 16 gap).
// Geist Mono 12px ≈ 7.2px/char. Chip padding+gap ≈ 5 chars; "+NN more" reserves ≈ 13 chars (2-digit safe).
// 1 line ≈ 77 chars, 2 lines ≈ 154 chars. Budgets sit well under that so the
// "+N more" toggle always shares the last line rather than orphaning — better a
// little slack than a stranded toggle.
const CHIP_PER_ITEM_COST = 5;
const STACK_MAX_CHARS = 58;
const STACK_MIN_ITEMS = 3;
const METHODS_MAX_CHARS = 112;
const METHODS_MIN_ITEMS = 3;

// Print list area ~604px (A4 1.5cm margins − gutter − 56 label − gap) with mono
// ~9px ≈ 5.4px/char ≈ 112 chars/line. The list is plain comma text, so each item
// only costs its ", " separator. Budgets target ~1 line (stack) / ~2 lines
// (methods), wrap-safe with room for the trailing "+N more".
const PRINT_PER_ITEM_COST = 2;
const PRINT_STACK_MAX_CHARS = 95;
const PRINT_METHODS_MAX_CHARS = 200;

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
  /** Print build only: render each role's full stack / methods list (see ChipList). */
  allStackSkills?: boolean;
  allMethodSkills?: boolean;
};

export function Experience({ entries, allStackSkills = false, allMethodSkills = false }: Props) {
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
                {entry.stack.length > 0 && (
                  <ChipList
                    label="Stack"
                    items={entry.stack}
                    maxChars={STACK_MAX_CHARS}
                    perItemCost={CHIP_PER_ITEM_COST}
                    minItems={STACK_MIN_ITEMS}
                    printMaxChars={PRINT_STACK_MAX_CHARS}
                    printPerItemCost={PRINT_PER_ITEM_COST}
                    variant="stack"
                    expand={allStackSkills}
                  />
                )}
                {entry.methods.length > 0 && (
                  <ChipList
                    label="Methods"
                    items={entry.methods}
                    maxChars={METHODS_MAX_CHARS}
                    perItemCost={CHIP_PER_ITEM_COST}
                    minItems={METHODS_MIN_ITEMS}
                    printMaxChars={PRINT_METHODS_MAX_CHARS}
                    printPerItemCost={PRINT_PER_ITEM_COST}
                    variant="methods"
                    expand={allMethodSkills}
                  />
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

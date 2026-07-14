import { ChipList } from '../ChipList';
import styles from './SkillChipGroups.module.css';

// Web chip area ~556px, Geist Mono 12px ≈ 77 chars/line; cost = text + ~5/item.
// Budgets stay under 1 line (stack) / 2 lines (domains) so "+N more" never orphans.
const CHIP_PER_ITEM_COST = 5;
const STACK_MAX_CHARS = 58;
const STACK_MIN_ITEMS = 3;
const DOMAINS_MAX_CHARS = 112;
const DOMAINS_MIN_ITEMS = 3;

// Print list ~604px, mono ~9px ≈ 112 chars/line; plain comma text (~2/item).
const PRINT_PER_ITEM_COST = 2;
const PRINT_STACK_MAX_CHARS = 95;
const PRINT_DOMAINS_MAX_CHARS = 200;

type Props = {
  stack: string[];
  domains: string[];
  /** Page-unique prefix for the ChipLists' CSS-only expand controls. */
  idPrefix: string;
  /** Print build only: expand each list in full (see ChipList). */
  allStackSkills?: boolean;
  allDomainSkills?: boolean;
};

// The Stack + Domains pair shown for an engagement or one of its projects.
export function SkillChipGroups({
  stack,
  domains,
  idPrefix,
  allStackSkills = false,
  allDomainSkills = false,
}: Props) {
  return (
    <div className={styles.groups}>
      {stack.length > 0 && (
        <ChipList
          id={`${idPrefix}-stack`}
          label="Stack"
          items={stack}
          maxChars={STACK_MAX_CHARS}
          perItemCost={CHIP_PER_ITEM_COST}
          minItems={STACK_MIN_ITEMS}
          printMaxChars={PRINT_STACK_MAX_CHARS}
          printPerItemCost={PRINT_PER_ITEM_COST}
          variant="stack"
          expand={allStackSkills}
        />
      )}
      {domains.length > 0 && (
        <ChipList
          id={`${idPrefix}-domains`}
          label="Domains"
          items={domains}
          maxChars={DOMAINS_MAX_CHARS}
          perItemCost={CHIP_PER_ITEM_COST}
          minItems={DOMAINS_MIN_ITEMS}
          printMaxChars={PRINT_DOMAINS_MAX_CHARS}
          printPerItemCost={PRINT_PER_ITEM_COST}
          variant="domains"
          expand={allDomainSkills}
        />
      )}
    </div>
  );
}

export type SliceResult<T> = {
  visible: T[];
  hidden: T[];
  hasMore: boolean;
  hiddenCount: number;
};

export type SliceOptions = {
  /** Soft budget on summed cost of visible items. */
  maxChars: number;
  /** Layout overhead added to each item's cost (e.g. chip padding + gap). */
  perItemCost?: number;
  /** Always include at least this many items, even if it exceeds the budget. */
  minItems?: number;
};

export function sliceList(items: string[], options: SliceOptions): SliceResult<string> {
  const { maxChars, perItemCost = 0, minItems = 1 } = options;
  let total = 0;
  let count = 0;

  for (const item of items) {
    const next = total + item.length + perItemCost;
    if (count >= minItems && next > maxChars) break;
    total = next;
    count++;
  }

  const visible = items.slice(0, count);
  const hidden = items.slice(count);
  return {
    visible,
    hidden,
    hasMore: hidden.length > 0,
    hiddenCount: hidden.length,
  };
}

export type SliceResult<T> = {
  visible: T[];
  hasMore: boolean;
  hiddenCount: number;
};

export function sliceList<T>(items: T[], limit: number, isOpen: boolean): SliceResult<T> {
  const hasMore = items.length > limit;
  const visible = hasMore && !isOpen ? items.slice(0, limit) : items.slice();
  const hiddenCount = hasMore ? items.length - limit : 0;
  return { visible, hasMore, hiddenCount };
}

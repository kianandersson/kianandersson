export type SliceResult<T> = {
  visible: T[];
  hidden: T[];
  hasMore: boolean;
  hiddenCount: number;
};

export function sliceList<T>(items: T[], limit: number): SliceResult<T> {
  const visible = items.slice(0, limit);
  const hidden = items.slice(limit);
  return {
    visible,
    hidden,
    hasMore: hidden.length > 0,
    hiddenCount: hidden.length,
  };
}

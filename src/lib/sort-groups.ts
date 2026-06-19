export function sortGroups<T extends { group: string }>(groups: T[], order: string[]): T[] {
  const orderMap = new Map(order.map((name, i) => [name, i]));
  return [...groups].sort((a, b) => {
    const aIdx = orderMap.get(a.group) ?? Number.MAX_SAFE_INTEGER;
    const bIdx = orderMap.get(b.group) ?? Number.MAX_SAFE_INTEGER;
    return aIdx - bIdx;
  });
}

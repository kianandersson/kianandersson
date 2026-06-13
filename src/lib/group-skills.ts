export type Grouped<T> = {
  group: string;
  items: T[];
};

export function groupSkills<T extends { group: string }>(items: T[]): Grouped<T>[] {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const bucket = groups.get(item.group);
    if (bucket) {
      bucket.push(item);
    } else {
      groups.set(item.group, [item]);
    }
  }
  return Array.from(groups, ([group, items]) => ({ group, items }));
}

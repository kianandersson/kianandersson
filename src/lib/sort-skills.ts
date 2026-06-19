export type Sortable = {
  level: number;
  years: number;
  name: string;
};

export function sortSkills<T extends Sortable>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (a.level !== b.level) return b.level - a.level;
    if (a.years !== b.years) return b.years - a.years;
    return a.name.localeCompare(b.name);
  });
}

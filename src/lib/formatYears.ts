export function formatYears(years: number): string {
  const suffix = years === 1 ? 'yr' : 'yrs';
  return `+${years} ${suffix}`;
}

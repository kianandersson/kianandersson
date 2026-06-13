export function formatYears(years: number): string {
  if (years === 0) return '<1 yrs';
  const suffix = years === 1 ? 'yr' : 'yrs';
  return `+${years} ${suffix}`;
}

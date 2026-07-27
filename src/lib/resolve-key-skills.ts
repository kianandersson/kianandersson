/**
 * Resolves a print build's `keySkills` override against the visible skills.
 *
 * The override mirrors editing the `featured` list in skills.yaml, but for a
 * single print: `names` fully replaces the default key skills, in order, and
 * each entry is resolved to a skill so the CV can inherit its level/years.
 *
 * Unlike the default reel — where an unmatched `featured` name is silently
 * dropped and a content test catches the typo — an options file has no such
 * test, so an unmatched override name throws. That way a client CV fails loudly
 * rather than quietly shipping without a headline skill.
 *
 * An empty `names` list resolves to an empty result, which the page treats as
 * "hide the Key skills section".
 */
export function resolveKeySkills<T>(names: string[], skillByName: Map<string, T>): T[] {
  return names.map((name) => {
    const skill = skillByName.get(name);
    if (skill === undefined) {
      throw new Error(`Key skill "${name}" matches no visible skill`);
    }
    return skill;
  });
}

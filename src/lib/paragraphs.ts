/**
 * Splits body copy into paragraphs on blank lines (a `\n\n` break), trimming
 * each and dropping empties. The shared convention for multi-paragraph text —
 * experience descriptions and the hero tagline both use it.
 */
export function toParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

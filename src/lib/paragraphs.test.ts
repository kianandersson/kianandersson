import { describe, expect, it } from 'vitest';
import { toParagraphs } from './paragraphs';

describe('toParagraphs', () => {
  it('returns a single paragraph unchanged', () => {
    expect(toParagraphs('One line.')).toEqual(['One line.']);
  });

  it('splits on a blank line', () => {
    expect(toParagraphs('First.\n\nSecond.')).toEqual(['First.', 'Second.']);
  });

  it('treats runs of blank lines as one break and trims each paragraph', () => {
    expect(toParagraphs('  First.  \n\n\n  Second.  ')).toEqual(['First.', 'Second.']);
  });

  it('does not split on a single newline', () => {
    expect(toParagraphs('First.\nStill first.')).toEqual(['First.\nStill first.']);
  });

  it('drops empty and whitespace-only paragraphs', () => {
    expect(toParagraphs('\n\nFirst.\n\n   \n\n')).toEqual(['First.']);
    expect(toParagraphs('   ')).toEqual([]);
  });
});

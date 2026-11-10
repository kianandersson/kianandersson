import { describe, expect, it } from 'vitest';
import { languageLevelLabel, languageNameLabel } from './language';

describe('languageNameLabel', () => {
  it('returns the English name as-is', () => {
    expect(languageNameLabel('Danish')).toBe('Danish');
  });

  it('returns the Danish name for the da locale', () => {
    expect(languageNameLabel('Danish', 'da')).toBe('Dansk');
    expect(languageNameLabel('English', 'da')).toBe('Engelsk');
  });
});

describe('languageLevelLabel', () => {
  it('returns the English level as-is', () => {
    expect(languageLevelLabel('Fluent')).toBe('Fluent');
  });

  it('returns the Danish level for the da locale', () => {
    expect(languageLevelLabel('Native', 'da')).toBe('Modersmål');
    expect(languageLevelLabel('Fluent', 'da')).toBe('Flydende');
  });
});

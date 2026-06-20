import { describe, expect, it } from 'vitest';
import { parsePrintOptions } from './print-options';

describe('parsePrintOptions', () => {
  it('returns null when the env is unset, empty, or whitespace', () => {
    expect(parsePrintOptions(undefined)).toBeNull();
    expect(parsePrintOptions('')).toBeNull();
    expect(parsePrintOptions('   ')).toBeNull();
  });

  it('returns null when every field is blank', () => {
    expect(parsePrintOptions('{}')).toBeNull();
    expect(parsePrintOptions('{"email":"","phone":""}')).toBeNull();
  });

  it('parses the private email and phone', () => {
    expect(parsePrintOptions('{"email":"me@example.com","phone":"+45 12 34 56 78"}')).toEqual({
      email: 'me@example.com',
      phone: '+45 12 34 56 78',
    });
  });

  it('ignores non-private fields (those come from the site config)', () => {
    expect(parsePrintOptions('{"email":"me@example.com","location":"Copenhagen"}')).toEqual({
      email: 'me@example.com',
    });
  });

  it('throws on malformed JSON', () => {
    expect(() => parsePrintOptions('{not json')).toThrow(/not valid JSON/);
  });

  it('throws when the email is invalid', () => {
    expect(() => parsePrintOptions('{"email":"nope"}')).toThrow();
  });
});

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

  it('parses minSkillLevel and coerces a numeric string', () => {
    expect(parsePrintOptions('{"email":"me@example.com","minSkillLevel":3}')).toEqual({
      email: 'me@example.com',
      minSkillLevel: 3,
    });
    expect(parsePrintOptions('{"minSkillLevel":"3"}')).toEqual({ minSkillLevel: 3 });
  });

  it('throws when minSkillLevel is out of range or not an integer', () => {
    expect(() => parsePrintOptions('{"minSkillLevel":0}')).toThrow();
    expect(() => parsePrintOptions('{"minSkillLevel":6}')).toThrow();
    expect(() => parsePrintOptions('{"minSkillLevel":2.5}')).toThrow();
  });

  it('parses allStackSkills and allMethodSkills independently', () => {
    expect(parsePrintOptions('{"allStackSkills":true}')).toEqual({ allStackSkills: true });
    expect(parsePrintOptions('{"allStackSkills":true,"allMethodSkills":true}')).toEqual({
      allStackSkills: true,
      allMethodSkills: true,
    });
  });

  it('throws when allStackSkills is not a boolean', () => {
    expect(() => parsePrintOptions('{"allStackSkills":"yes"}')).toThrow();
  });

  it('parses profilePhoto when explicitly excluded', () => {
    expect(parsePrintOptions('{"profilePhoto":false}')).toEqual({ profilePhoto: false });
  });

  it('throws when profilePhoto is not a boolean', () => {
    expect(() => parsePrintOptions('{"profilePhoto":"no"}')).toThrow();
  });
});

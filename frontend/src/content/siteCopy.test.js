import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveGroup, overridesFor, GROUP_FIELDS, COPY_SCHEMA } from './siteCopy';

const fields = [
  { key: 'title', default: 'Hello' },
  { key: 'note', default: 'A note' },
];

describe('resolveGroup', () => {
  it('uses the defaults when nothing is saved', () => {
    expect(resolveGroup(fields, undefined)).toEqual({ title: 'Hello', note: 'A note' });
  });

  it('applies an override and leaves the rest alone', () => {
    expect(resolveGroup(fields, { title: 'Hi there' })).toEqual({ title: 'Hi there', note: 'A note' });
  });

  it('falls back to the default for blank or non-string values', () => {
    expect(resolveGroup(fields, { title: '  ', note: 42 })).toEqual({ title: 'Hello', note: 'A note' });
  });

  it('never returns keys the schema does not know', () => {
    expect(Object.keys(resolveGroup(fields, { title: 'Hi', removed: 'x' })).sort()).toEqual(['note', 'title']);
  });
});

describe('overridesFor', () => {
  it('stores only what differs from the defaults', () => {
    const draft = { gallery: { heading: 'New title', intro: GROUP_FIELDS.gallery.find((f) => f.key === 'intro').default } };
    expect(overridesFor(draft)).toEqual({ gallery: { heading: 'New title' } });
  });

  it('drops groups with nothing changed', () => {
    expect(overridesFor({})).toEqual({});
  });
});

describe('copy schema', () => {
  it('has unique keys and string defaults', () => {
    for (const group of COPY_SCHEMA) {
      const keys = group.fields.map((f) => f.key);
      expect(new Set(keys).size, group.key).toBe(keys.length);
      group.fields.forEach((f) => expect(typeof f.default, `${group.key}.${f.key}`).toBe('string'));
    }
  });

  it('has no en dashes or em dashes in any default', () => {
    for (const group of COPY_SCHEMA) {
      group.fields.forEach((f) => expect(f.default, `${group.key}.${f.key}`).not.toMatch(/[\u2013\u2014]/));
    }
  });

  it('renders every field somewhere on the site', () => {
    const srcRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
    const collect = (dir, out = []) => {
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) collect(full, out);
        else if (/\.js$/.test(entry) && !/\.test\.js$/.test(entry)) out.push(full);
      }
      return out;
    };
    const haystack = ['pages', 'components', 'App.js']
      .flatMap((p) => (p.endsWith('.js') ? [join(srcRoot, p)] : collect(join(srcRoot, p))))
      .map((f) => readFileSync(f, 'utf8'))
      .join('\n');

    const orphaned = COPY_SCHEMA.flatMap((group) =>
      group.fields.filter((f) => !haystack.includes(`.${f.key}`)).map((f) => `${group.key}.${f.key}`));
    expect(orphaned).toEqual([]);
  });
});

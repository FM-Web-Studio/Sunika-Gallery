import { describe, it, expect } from 'vitest';
import { sortByOrder, byOrderThenNewest, moveItem } from './ordering';

const doc = (id, order, seconds) => ({
  id,
  ...(order === undefined ? {} : { order }),
  ...(seconds === undefined ? {} : { createdAt: { seconds } }),
});

const ids = (list) => list.map((d) => d.id);

describe('sortByOrder', () => {
  it('sorts ascending by order', () => {
    expect(ids(sortByOrder([doc('c', 3), doc('a', 1), doc('b', 2)]))).toEqual(['a', 'b', 'c']);
  });

  it('puts unplaced pieces last so they never jump ahead of curated ones', () => {
    expect(ids(sortByOrder([doc('none'), doc('first', 1), doc('second', 2)]))).toEqual(['first', 'second', 'none']);
  });

  it('treats a non-numeric order as unplaced', () => {
    expect(ids(sortByOrder([doc('bad', '2'), doc('good', 5)]))).toEqual(['good', 'bad']);
  });

  it('breaks ties on newest first', () => {
    expect(ids(sortByOrder([doc('old', 1, 100), doc('new', 1, 900)]))).toEqual(['new', 'old']);
  });

  it('does not mutate its input', () => {
    const input = [doc('b', 2), doc('a', 1)];
    sortByOrder(input);
    expect(ids(input)).toEqual(['b', 'a']);
  });

  it('handles empty input and null entries', () => {
    expect(sortByOrder()).toEqual([]);
    expect(() => [null, doc('a', 1)].sort(byOrderThenNewest)).not.toThrow();
  });
});

describe('moveItem', () => {
  it('moves an item up and down', () => {
    expect(moveItem(['a', 'b', 'c'], 2, 0)).toEqual(['c', 'a', 'b']);
    expect(moveItem(['a', 'b', 'c'], 0, 1)).toEqual(['b', 'a', 'c']);
  });

  it('returns the same list when the move goes off either end', () => {
    const list = ['a', 'b'];
    expect(moveItem(list, 0, -1)).toBe(list);
    expect(moveItem(list, 1, 2)).toBe(list);
  });
});

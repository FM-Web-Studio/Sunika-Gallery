import { describe, it, expect } from 'vitest';
import { filterArtworks, galleryStats, fillTemplate, formatPrice, artworkSrc, artworkMeta, ALL } from './gallery';

const art = (id, extra = {}) => ({ id, category: 'Paintings', sold: false, price: 0, likeCount: 0, ratingSum: 0, ratingCount: 0, ...extra });
const ids = (list) => list.map((a) => a.id);

const wall = [
  art('a', { category: 'Paintings', price: 500, likeCount: 2, createdAt: { seconds: 10 } }),
  art('b', { category: 'Drawings', sold: true, price: 1200, likeCount: 9, ratingSum: 10, ratingCount: 2, createdAt: { seconds: 30 } }),
  art('c', { category: 'Paintings', price: 0, likeCount: 4, ratingSum: 5, ratingCount: 1, createdAt: { seconds: 20 } }),
];

describe('filterArtworks', () => {
  it('keeps the curated order by default', () => {
    expect(ids(filterArtworks(wall))).toEqual(['a', 'b', 'c']);
  });

  it('filters by category and status together', () => {
    expect(ids(filterArtworks(wall, { category: 'Paintings' }))).toEqual(['a', 'c']);
    expect(ids(filterArtworks(wall, { status: 'sold' }))).toEqual(['b']);
    expect(ids(filterArtworks(wall, { category: 'Paintings', status: 'available' }))).toEqual(['a', 'c']);
    expect(ids(filterArtworks(wall, { category: ALL, status: 'available' }))).toEqual(['a', 'c']);
  });

  it('sorts by newest, likes and rating', () => {
    expect(ids(filterArtworks(wall, { sort: 'newest' }))).toEqual(['b', 'c', 'a']);
    expect(ids(filterArtworks(wall, { sort: 'loved' }))).toEqual(['b', 'c', 'a']);
    expect(ids(filterArtworks(wall, { sort: 'rated' }))).toEqual(['b', 'c', 'a']);
  });

  it('puts pieces with no price last in both price sorts', () => {
    expect(ids(filterArtworks(wall, { sort: 'price-asc' }))).toEqual(['a', 'b', 'c']);
    expect(ids(filterArtworks(wall, { sort: 'price-desc' }))).toEqual(['b', 'a', 'c']);
  });

  it('does not mutate the input', () => {
    const before = ids(wall);
    filterArtworks(wall, { sort: 'newest' });
    expect(ids(wall)).toEqual(before);
  });
});

describe('helpers', () => {
  it('counts what is still available', () => {
    expect(galleryStats(wall)).toEqual({ total: 3, available: 2 });
  });

  it('fills a template and leaves unknown keys alone', () => {
    expect(fillTemplate('{total} pieces, {available} free, {x}', { total: 3, available: 2 })).toBe('3 pieces, 2 free, {x}');
  });

  it('formats prices in rand and asks for a price when there is none', () => {
    expect(formatPrice(0)).toBe('Price on request');
    expect(formatPrice('abc')).toBe('Price on request');
    expect(formatPrice(1500)).toMatch(/^R 1.500$/);
  });

  it('prefers the web copy of an image', () => {
    expect(artworkSrc({ webUrl: 'w', imageUrl: 'o' })).toBe('w');
    expect(artworkSrc({ imageUrl: 'o' })).toBe('o');
    expect(artworkSrc(null)).toBe('');
  });

  it('joins meta without empty parts', () => {
    expect(artworkMeta({ category: 'Drawings', dimensions: '' })).toBe('Drawings');
    expect(artworkMeta({ category: 'Drawings', dimensions: '30 x 40 cm' })).toBe('Drawings, 30 x 40 cm');
  });
});

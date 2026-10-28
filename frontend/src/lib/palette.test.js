import { describe, it, expect } from 'vitest';
import { accentFor, accentFromPixels, CANDY } from './palette';

const pixels = (...colours) => new Uint8ClampedArray(colours.flatMap(([r, g, b, n = 1]) => Array.from({ length: n }, () => [r, g, b, 255]).flat()));

describe('accentFor', () => {
  it('uses a stored accent when it is a valid colour', () => {
    expect(accentFor({ id: 'x', accent: '#112233' })).toBe('#112233');
  });

  it('falls back to a stable brand colour per artwork', () => {
    const a = accentFor({ id: 'abc' });
    expect(CANDY).toContain(a);
    expect(accentFor({ id: 'abc', accent: 'red' })).toBe(a);
  });
});

describe('accentFromPixels', () => {
  it('picks the dominant saturated colour, ignoring greys and darks', () => {
    const out = accentFromPixels(pixels([200, 30, 30, 10], [128, 128, 128, 50], [5, 5, 5, 50]));
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(out.slice(i, i + 2), 16));
    expect(r).toBeGreaterThan(g * 2);
    expect(r).toBeGreaterThan(b * 2);
  });

  it('still returns a colour for a fully grey image', () => {
    expect(accentFromPixels(pixels([120, 120, 120, 4]))).toMatch(/^#[0-9A-F]{6}$/);
  });

  it('handles an empty image', () => {
    expect(accentFromPixels(new Uint8ClampedArray())).toBe(CANDY[0]);
  });
});

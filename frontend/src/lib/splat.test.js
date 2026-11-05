import { describe, it, expect } from 'vitest';
import { rng, splatShape } from './splat';

describe('rng', () => {
  it('repeats for the same seed and stays between 0 and 1', () => {
    const a = rng(42);
    const b = rng(42);
    for (let i = 0; i < 50; i += 1) {
      const v = a();
      expect(v).toBe(b());
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('splatShape', () => {
  it('draws the same splat for the same seed, so it survives a redraw', () => {
    expect(splatShape(7)).toEqual(splatShape(7));
    expect(splatShape(7)).not.toEqual(splatShape(8));
  });

  it('always has a centre blob, some bumps and some flung drops', () => {
    for (let seed = 1; seed < 40; seed += 1) {
      const { blobs, drops, drips } = splatShape(seed);
      expect(blobs[0]).toEqual({ x: 0, y: 0, r: 1 });
      expect(blobs.length).toBeGreaterThanOrEqual(8);
      expect(drops.length).toBeGreaterThanOrEqual(6);
      expect(drips.length).toBeLessThanOrEqual(2);
      drops.forEach((d) => expect(Math.hypot(d.x, d.y)).toBeGreaterThan(1.3));
    }
  });
});

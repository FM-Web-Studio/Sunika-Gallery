import { describe, it, expect } from 'vitest';
import { lengthOf, pathFrom, wavePoints } from './wave';

describe('wavePoints', () => {
  const opts = { width: 1200, wavelength: 600, amplitude: 20, centre: 80 };

  it('starts and ends at the same height, so two copies join without a seam', () => {
    const pts = wavePoints(opts);
    expect(pts[0][0]).toBe(0);
    expect(pts[pts.length - 1][0]).toBe(1200);
    expect(pts[0][1]).toBeCloseTo(pts[pts.length - 1][1], 6);
  });

  it('stays inside the amplitude', () => {
    wavePoints(opts).forEach(([, y]) => {
      expect(y).toBeGreaterThanOrEqual(60 - 1e-9);
      expect(y).toBeLessThanOrEqual(100 + 1e-9);
    });
  });

  it('always reaches the far edge even when the step does not divide the width', () => {
    const pts = wavePoints({ ...opts, step: 7 });
    expect(pts[pts.length - 1][0]).toBe(1200);
  });
});

describe('pathFrom and lengthOf', () => {
  it('draws a path that begins with a move', () => {
    expect(pathFrom([[0, 1], [10, 2]])).toBe('M0.0 1.00 L10.0 2.00');
  });

  it('measures a wave as longer than a straight line', () => {
    expect(lengthOf([[0, 0], [3, 4]])).toBe(5);
    expect(lengthOf(wavePoints({ width: 1200, wavelength: 600, amplitude: 20, centre: 80 }))).toBeGreaterThan(1200);
  });
});

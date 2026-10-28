import { describe, it, expect } from 'vitest';
import { watermarkSvg, watermarkUrl } from './watermark';

describe('watermark', () => {
  it('puts the name and the address into the tile', () => {
    const svg = watermarkSvg('© Sunika', 'sunika-studio-gallery.web.app');
    expect(svg).toContain('© Sunika');
    expect(svg).toContain('sunika-studio-gallery.web.app');
  });

  it('escapes characters that would break the SVG', () => {
    const svg = watermarkSvg('Tom & Jerry <art>');
    expect(svg).toContain('Tom &amp; Jerry &lt;art&gt;');
    expect(svg).not.toContain('<art>');
  });

  it('leaves out the second line when there is none', () => {
    expect(watermarkSvg('A').match(/<text/g)).toHaveLength(1);
  });

  it('returns a CSS url that is stable for the same text', () => {
    const a = watermarkUrl('A', 'b');
    expect(a.startsWith('url("data:image/svg+xml,')).toBe(true);
    expect(watermarkUrl('A', 'b')).toBe(a);
  });
});

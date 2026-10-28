export const CANDY = ['#E5177B', '#F7931E', '#4FB9A6', '#D7262F', '#8E5BD8', '#F2A81D', '#2D8BD6'];

const HEX = /^#[0-9a-f]{6}$/i;

const hashOf = (id = '') => {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
};

export const accentFor = (artwork) =>
  (HEX.test(artwork?.accent || '') ? artwork.accent : CANDY[hashOf(artwork?.id) % CANDY.length]);

const toHsv = (r, g, b) => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
    if (h < 0) h += 1;
  }
  return [h, max ? d / max : 0, max];
};

const fromHsv = (h, s, v) => {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  return [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][i % 6];
};

const hex = (n) => Math.round(n * 255).toString(16).padStart(2, '0').toUpperCase();

export const accentFromPixels = (data) => {
  const buckets = Array.from({ length: 12 }, () => [0, 0, 0, 0]);
  const total = [0, 0, 0, 0];
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;
    total[0] += r; total[1] += g; total[2] += b; total[3] += 1;
    const [h, s, v] = toHsv(r, g, b);
    if (v < 0.18 || s < 0.18) continue;
    const w = s * v;
    const k = buckets[Math.floor(h * 12) % 12];
    k[0] += r * w; k[1] += g * w; k[2] += b * w; k[3] += w;
  }
  const best = buckets.reduce((a, b) => (b[3] > a[3] ? b : a));
  const src = best[3] > 0 ? best : total;
  if (!src[3]) return CANDY[0];
  const [h, s, v] = toHsv(src[0] / src[3], src[1] / src[3], src[2] / src[3]);
  const [r, g, b] = fromHsv(h, Math.min(Math.max(s, 0.35), 0.85), Math.min(Math.max(v, 0.5), 0.85));
  return `#${hex(r)}${hex(g)}${hex(b)}`;
};

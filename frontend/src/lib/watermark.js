const escapeXml = (s = '') => s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));

const cache = new Map();

export const TILE_W = 300;
export const TILE_H = 210;

const stamp = (x, y, main, sub) => `<g transform="translate(${x} ${y}) rotate(-28)">`
  + `<text y="0" font-size="26" font-weight="700" fill="rgba(255,255,255,0.92)">${main}</text>`
  + (sub ? `<text y="22" font-size="12" font-weight="600" letter-spacing="1.6" fill="rgba(255,255,255,0.85)">${sub}</text>` : '')
  + '</g>';

export const watermarkSvg = (line, subline = '') => {
  const main = escapeXml(line);
  const sub = escapeXml(subline);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE_W}" height="${TILE_H}" viewBox="0 0 ${TILE_W} ${TILE_H}">`
    + '<g font-family="Arial, Helvetica, sans-serif" text-anchor="middle" paint-order="stroke" stroke="rgba(20,6,10,0.6)" stroke-width="3" stroke-linejoin="round">'
    + stamp(TILE_W * 0.25, TILE_H * 0.3, main, sub)
    + stamp(TILE_W * 0.75, TILE_H * 0.8, main, sub)
    + '</g></svg>';
};

export const watermarkUrl = (line, subline = '') => {
  const key = `${line}|${subline}`;
  if (!cache.has(key)) cache.set(key, `url("data:image/svg+xml,${encodeURIComponent(watermarkSvg(line, subline))}")`);
  return cache.get(key);
};

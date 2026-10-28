const escapeXml = (s = '') => s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));

const cache = new Map();

export const watermarkSvg = (line, subline = '') => {
  const main = escapeXml(line);
  const sub = escapeXml(subline);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="190" viewBox="0 0 280 190">`
    + '<g transform="rotate(-28 140 95)" font-family="Georgia, \'Times New Roman\', serif" text-anchor="middle" paint-order="stroke" stroke="rgba(20,6,10,0.45)" stroke-width="2.4" stroke-linejoin="round">'
    + `<text x="140" y="94" font-size="24" font-style="italic" font-weight="600" fill="rgba(255,255,255,0.78)">${main}</text>`
    + (sub ? `<text x="140" y="118" font-size="11" letter-spacing="1.5" fill="rgba(255,255,255,0.7)">${sub}</text>` : '')
    + '</g></svg>';
};

export const watermarkUrl = (line, subline = '') => {
  const key = `${line}|${subline}`;
  if (!cache.has(key)) cache.set(key, `url("data:image/svg+xml,${encodeURIComponent(watermarkSvg(line, subline))}")`);
  return cache.get(key);
};

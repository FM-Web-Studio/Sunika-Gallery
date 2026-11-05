export const rng = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const splatShape = (seed) => {
  const r = rng(seed);
  const blobs = [{ x: 0, y: 0, r: 1 }];
  const bumps = 7 + Math.floor(r() * 6);
  for (let i = 0; i < bumps; i += 1) {
    const a = (i / bumps) * Math.PI * 2 + r() * 0.5;
    const d = 0.7 + r() * 0.35;
    blobs.push({ x: Math.cos(a) * d, y: Math.sin(a) * d, r: 0.3 + r() * 0.35 });
  }
  const drops = Array.from({ length: 6 + Math.floor(r() * 8) }, () => {
    const a = r() * Math.PI * 2;
    const d = 1.4 + r() * 1.8;
    return { x: Math.cos(a) * d, y: Math.sin(a) * d, r: 0.06 + r() * 0.16 };
  });
  const drips = Array.from({ length: Math.floor(r() * 3) }, () => ({
    x: (r() - 0.5) * 1.2,
    w: 0.12 + r() * 0.12,
    len: 1 + r() * 2.2,
  }));
  return { blobs, drops, drips };
};

import { useEffect, useRef, useState } from 'react';
import { FiRotateCcw } from 'react-icons/fi';
import { usePrefs } from '../../hooks/usePrefs';
import { rng, splatShape } from '../../lib/splat';
import styles from './PaintSplat.module.css';

const COLOURS = [
  { key: 'mix', label: 'Every colour' },
  { key: '#E5177B', label: 'Pink' },
  { key: '#F7931E', label: 'Orange' },
  { key: '#F2A81D', label: 'Yellow' },
  { key: '#4FB9A6', label: 'Teal' },
  { key: '#2D8BD6', label: 'Blue' },
  { key: '#8E5BD8', label: 'Purple' },
];
const MIX = COLOURS.slice(1).map((c) => c.key);
const GROW_MS = 160;
const DRIP_MS = 1400;
const MAX_SPLATS = 400;
const MAX_DPR = 2;

const easeOut = (t) => 1 - (1 - t) ** 3;
const easeBack = (t) => 1 + 2.2 * (t - 1) ** 3 + 1.2 * (t - 1) ** 2;

const PaintSplat = ({ copy }) => {
  const { reduceMotion } = usePrefs();
  const canvasRef = useRef(null);
  const api = useRef(null);
  const still = useRef(reduceMotion);
  const [colour, setColour] = useState('mix');
  const [count, setCount] = useState(0);

  still.current = reduceMotion;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const splats = [];
    let frame = 0;
    let w = 0;
    let h = 0;
    let mixAt = 0;

    const drawSplat = (s, now) => {
      const age = still.current ? Infinity : now - s.born;
      const grow = Math.min(1, age / GROW_MS);
      const drip = easeOut(Math.min(1, age / DRIP_MS));
      const size = s.size * (20 + w * 0.012) * easeBack(grow);
      const { blobs, drops, drips } = splatShape(s.seed);
      const cx = s.x * w;
      const cy = s.y * h;
      ctx.fillStyle = s.colour;
      ctx.beginPath();
      blobs.forEach((b) => {
        ctx.moveTo(cx + b.x * size + b.r * size, cy + b.y * size);
        ctx.arc(cx + b.x * size, cy + b.y * size, b.r * size, 0, Math.PI * 2);
      });
      drops.forEach((d) => {
        const dx = cx + d.x * size * (0.6 + 0.4 * grow);
        const dy = cy + d.y * size * (0.6 + 0.4 * grow);
        ctx.moveTo(dx + d.r * size, dy);
        ctx.arc(dx, dy, d.r * size, 0, Math.PI * 2);
      });
      ctx.fill();
      drips.forEach((d) => {
        const len = d.len * size * drip;
        if (len < 1) return;
        const x = cx + d.x * size;
        const r = (d.w * size) / 2;
        ctx.fillRect(x - r, cy, r * 2, len);
        ctx.beginPath();
        ctx.arc(x, cy + len, r * 1.25, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const draw = () => {
      frame = 0;
      const now = performance.now();
      ctx.clearRect(0, 0, w, h);
      splats.forEach((s) => drawSplat(s, now));
      const busy = !still.current && splats.some((s) => now - s.born < DRIP_MS);
      if (busy) frame = requestAnimationFrame(draw);
    };

    const wake = () => { if (!frame) frame = requestAnimationFrame(draw); };

    const fit = () => {
      const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const throwAt = (x, y, pick) => {
      const seed = Math.floor(Math.random() * 2 ** 31);
      const r = rng(seed);
      let c = pick;
      if (pick === 'mix') {
        c = MIX[mixAt % MIX.length];
        mixAt += 1;
      }
      splats.push({ x, y, seed, colour: c, size: 0.7 + r() * 0.6, born: performance.now() });
      if (splats.length > MAX_SPLATS) splats.shift();
      setCount(splats.length);
      wake();
    };

    const clear = () => {
      splats.length = 0;
      setCount(0);
      wake();
    };

    api.current = { throwAt, clear };
    const size = new ResizeObserver(fit);
    size.observe(canvas);

    return () => {
      size.disconnect();
      cancelAnimationFrame(frame);
      api.current = null;
    };
  }, []);

  const onDown = (e) => {
    if (e.button !== 0) return;
    const r = canvasRef.current.getBoundingClientRect();
    api.current?.throwAt((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height, colour);
  };

  const onKey = (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    api.current?.throwAt(0.15 + Math.random() * 0.7, 0.15 + Math.random() * 0.6, colour);
  };

  return (
    <section className={styles.play} aria-labelledby="play-title">
      <div className={styles.text}>
        <h2 id="play-title" className={styles.title}>{copy.playTitle}</h2>
        <p className={styles.lede}>{copy.playIntro}</p>
      </div>

      <div className={styles.frame}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          tabIndex={0}
          onPointerDown={onDown}
          onKeyDown={onKey}
          aria-label={`${copy.playHint}. Press Enter to throw paint.`}
        />
        <span className={`${styles.hint} ${count ? styles.hintGone : ''}`} aria-hidden="true">{copy.playHint}</span>
      </div>

      <div className={styles.tools}>
        <div className={styles.swatches} role="group" aria-label="Paint colour">
          {COLOURS.map((c) => (
            <button
              key={c.key}
              type="button"
              className={`${styles.swatch} ${c.key === 'mix' ? styles.mix : ''} ${colour === c.key ? styles.on : ''}`}
              style={c.key === 'mix' ? undefined : { '--swatch': c.key }}
              aria-pressed={colour === c.key}
              aria-label={c.label}
              title={c.label}
              onClick={() => setColour(c.key)}
            />
          ))}
        </div>
        <button type="button" className="btn btn-quiet" onClick={() => api.current?.clear()} disabled={!count}>
          <FiRotateCcw aria-hidden="true" /> {copy.playClear}
        </button>
      </div>
    </section>
  );
};

export default PaintSplat;

import { useEffect, useId, useMemo, useState } from 'react';
import { useOnScreen } from '../../hooks/useOnScreen';
import { lengthOf, pathFrom, wavePoints } from '../../lib/wave';
import styles from './WaveRibbon.module.css';

const H = 180;
const FONT = 32;
const SEP = '   ✦   ';
const FRONT_WAVE = 600;
const BACK_WAVE = 800;
const MIN_PERIOD = 2800;
const FRONT_SPEED = 64;
const BACK_SPEED = 46;
const STRETCH = lengthOf(wavePoints({ width: FRONT_WAVE, wavelength: FRONT_WAVE, amplitude: 24, centre: 92 })) / FRONT_WAVE;

const ribbonFor = (textWidth) => {
  const copies = Math.max(1, Math.ceil(MIN_PERIOD / Math.max(1, textWidth)));
  const rough = (copies * textWidth) / STRETCH;
  const waves = Math.max(2, Math.round(rough / FRONT_WAVE));
  const width = Math.round(rough);
  const front = wavePoints({ width, wavelength: width / waves, amplitude: 24, centre: 92 });
  const back = wavePoints({ width, wavelength: width / Math.max(2, Math.round(width / BACK_WAVE)), amplitude: 34, centre: 86, phase: 0.5 });
  return { width, copies, frontD: pathFrom(front), backD: pathFrom(back), frontLen: lengthOf(front) };
};

const measure = (text) => {
  try {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.font = `600 ${FONT}px Fredoka, Nunito, sans-serif`;
    return ctx.measureText(text).width;
  } catch {
    return text.length * FONT * 0.55;
  }
};

const Front = ({ id, line, r }) => (
  <svg className={styles.half} width={r.width} height={H} viewBox={`0 0 ${r.width} ${H}`}>
    <path d={r.frontD} className={styles.shade} transform="translate(0 7)" />
    <path id={id} d={r.frontD} className={styles.band} />
    <path d={r.frontD} className={styles.shine} transform="translate(0 -27)" />
    <text className={styles.words} dominantBaseline="central">
      <textPath href={`#${id}`} textLength={r.frontLen} lengthAdjust="spacing">{line}</textPath>
    </text>
  </svg>
);

const Back = ({ r }) => (
  <svg className={styles.half} width={r.width} height={H} viewBox={`0 0 ${r.width} ${H}`}>
    <path d={r.backD} className={styles.backBand} />
    <path d={r.backD} className={styles.stitch} />
  </svg>
);

const WaveRibbon = ({ text }) => {
  const id = useId().replace(/:/g, '');
  const items = useMemo(() => text.split(',').map((s) => s.trim()).filter(Boolean), [text]);
  const unit = items.join(SEP) + SEP;
  const [textWidth, setTextWidth] = useState(() => unit.length * FONT * 0.5);
  const [ref, onScreen] = useOnScreen();

  useEffect(() => {
    let live = true;
    const fit = () => { if (live) setTextWidth(measure(unit)); };
    fit();
    document.fonts?.ready.then(fit);
    return () => { live = false; };
  }, [unit]);

  const r = useMemo(() => ribbonFor(textWidth), [textWidth]);

  if (!items.length) return null;

  const line = unit.repeat(r.copies);

  return (
    <div ref={ref} className={`${styles.ribbon} ${onScreen ? '' : styles.idle}`} style={{ '--period': `${r.width}px`, '--front-s': `${(r.width / FRONT_SPEED).toFixed(1)}s`, '--back-s': `${(r.width / BACK_SPEED).toFixed(1)}s` }}>
      <p className="sr-only">{items.join(', ')}</p>
      <div className={styles.scale} aria-hidden="true">
        <div className={`${styles.track} ${styles.back}`}>
          <Back r={r} />
          <Back r={r} />
        </div>
        <div className={`${styles.track} ${styles.front}`}>
          <Front id={`${id}a`} line={line} r={r} />
          <Front id={`${id}b`} line={line} r={r} />
        </div>
      </div>
    </div>
  );
};

export default WaveRibbon;

import { useEffect, useRef, useState } from 'react';
import { usePrefs } from '../hooks/usePrefs';
import styles from './CursorBubble.module.css';

const CursorBubble = () => {
  const { reduceMotion } = usePrefs();
  const el = useRef(null);
  const [label, setLabel] = useState('');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.('(hover: hover) and (pointer: fine)');
    const sync = () => setEnabled(!!mq?.matches);
    sync();
    mq?.addEventListener('change', sync);
    return () => mq?.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    const target = { x: -200, y: -200 };
    const pos = { x: -200, y: -200 };
    let frame = 0;

    const loop = () => {
      const ease = reduceMotion ? 1 : 0.2;
      pos.x += (target.x - pos.x) * ease;
      pos.y += (target.y - pos.y) * ease;
      if (el.current) el.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      frame = requestAnimationFrame(loop);
    };

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const hit = e.target.closest?.('[data-cursor]');
      setLabel(hit ? hit.dataset.cursor : '');
    };

    const onLeave = () => setLabel('');

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    frame = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(frame);
    };
  }, [enabled, reduceMotion]);

  if (!enabled) return null;

  return (
    <div ref={el} className={styles.anchor} aria-hidden="true">
      <span className={`${styles.bubble} ${label ? styles.on : ''}`}>{label}</span>
    </div>
  );
};

export default CursorBubble;

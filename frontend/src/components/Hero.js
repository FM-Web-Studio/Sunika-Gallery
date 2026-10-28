import { useEffect, useRef, useState } from 'react';
import { FiArrowDown } from 'react-icons/fi';
import ArtImage from './ArtImage';
import { usePrefs } from '../hooks/usePrefs';
import { artworkMeta, artworkSrc, formatPrice } from '../lib/gallery';
import { accentFor } from '../lib/palette';
import styles from './Hero.module.css';

const DURATION = 4500;

const Hero = ({ pieces, onOpen, cta }) => {
  const { reduceMotion } = usePrefs();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);

  const count = pieces.length;
  const playing = count > 1 && !paused && !reduceMotion;

  useEffect(() => { if (index >= count) setIndex(0); }, [count, index]);

  useEffect(() => {
    if (!playing) return undefined;
    timer.current = setTimeout(() => setIndex((i) => (i + 1) % count), DURATION);
    return () => clearTimeout(timer.current);
  }, [playing, index, count]);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  if (!count) return <section className={`${styles.hero} ${styles.empty}`} aria-hidden="true" />;

  const current = pieces[Math.min(index, count - 1)];

  return (
    <section
      className={styles.hero}
      style={{ '--accent': accentFor(current) }}
      aria-roledescription="carousel"
      aria-label="Featured works"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {pieces.map((p, i) => (
        <div key={p.id} className={`${styles.slide} ${i === index ? styles.on : ''}`} aria-hidden={i !== index}>
          {(i === index || i === (index + 1) % count || i === (index - 1 + count) % count) && (
            <>
              <img className={styles.glow} src={artworkSrc(p)} alt="" draggable="false" />
              <div className={styles.veil} aria-hidden="true" />
              <div className={styles.artWrap}>
                <button type="button" className={styles.art} onClick={() => onOpen(p.id)} tabIndex={i === index ? 0 : -1} aria-label={`Open ${p.title}`}>
                  <ArtImage src={artworkSrc(p)} alt={p.title || 'Artwork'} eager={i === index || i === (index + 1) % count} />
                </button>
              </div>
            </>
          )}
        </div>
      ))}

      <div key={current.id} className={styles.caption}>
        <p className={styles.status}>
          <span className={current.sold ? styles.soldDot : styles.availDot} aria-hidden="true" />
          {current.sold ? 'Found a home' : 'Available'}
        </p>
        <h2 className={styles.title}>{current.title || 'Untitled'}</h2>
        <p className={styles.meta}>
          {[artworkMeta(current), current.sold ? '' : formatPrice(current.price)].filter(Boolean).join(', ')}
        </p>
        <button type="button" className={`btn btn-candy ${styles.cta}`} onClick={() => onOpen(current.id)}>
          {cta}
        </button>
      </div>

      {count > 1 && (
        <div className={styles.progress} role="tablist" aria-label="Choose a featured work">
          {pieces.map((p, i) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={p.title}
              className={`${styles.bar} ${i === index ? styles.barOn : ''} ${i < index ? styles.barDone : ''}`}
              style={{ '--duration': `${DURATION}ms`, '--state': playing ? 'running' : 'paused' }}
              onClick={() => setIndex(i)}
            >
              <span />
            </button>
          ))}
        </div>
      )}

      <a href="#collection" className={styles.scroll}>
        <FiArrowDown aria-hidden="true" />
        <span>Explore the collection</span>
      </a>
    </section>
  );
};

export default Hero;

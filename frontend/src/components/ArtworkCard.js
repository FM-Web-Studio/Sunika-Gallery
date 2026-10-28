import { useRef } from 'react';
import { FaHeart } from 'react-icons/fa';
import ArtImage from './ArtImage';
import { artworkMeta, artworkSrc, formatPrice } from '../lib/gallery';
import { accentFor } from '../lib/palette';
import styles from './ArtworkCard.module.css';

const ArtworkCard = ({ artwork, onOpen, eager = false }) => {
  const stage = useRef(null);
  const title = artwork.title || 'Untitled';
  const likes = artwork.likeCount || 0;
  const meta = artworkMeta(artwork);

  const tilt = (e) => {
    const el = stage.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--rx', `${(-y * 9).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${(x * 11).toFixed(2)}deg`);
    el.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(1)}%`);
  };

  const reset = () => {
    const el = stage.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <article className={styles.card} style={{ '--accent': accentFor(artwork) }}>
      <button
        ref={stage}
        type="button"
        className={styles.stage}
        onClick={() => onOpen(artwork.id)}
        onPointerMove={tilt}
        onPointerLeave={reset}
        data-cursor={artwork.sold ? 'Admire' : 'View'}
        aria-label={`Look closer at ${title}`}
      >
        <span className={styles.wash} aria-hidden="true" />
        <span className={styles.piece}>
          <ArtImage src={artworkSrc(artwork)} alt={title} eager={eager} />
        </span>
        {artwork.sold && <span className={styles.sticker}>Sold</span>}
      </button>

      <div className={styles.caption}>
        <h3 className={`${styles.title} art-title`}>{title}</h3>
        {meta && <p className={styles.meta}>{meta}</p>}
        <p className={styles.foot}>
          {artwork.sold
            ? <span className={styles.sold}>Found a home</span>
            : <span className={styles.price}>{formatPrice(artwork.price)}</span>}
          {likes > 0 && (
            <span className={styles.likes} aria-label={`${likes} ${likes === 1 ? 'heart' : 'hearts'}`}>
              <FaHeart aria-hidden="true" /> {likes}
            </span>
          )}
        </p>
      </div>
    </article>
  );
};

export default ArtworkCard;

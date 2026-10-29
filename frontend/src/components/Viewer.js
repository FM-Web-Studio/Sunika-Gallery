import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ArtImage from './ArtImage';
import Stars from './Stars';
import LikeButton from './LikeButton';
import { pauseScroll, resumeScroll } from '../hooks/useMomentumScroll';
import { artworkMeta, artworkSrc, formatPrice } from '../lib/gallery';
import { accentFor } from '../lib/palette';
import styles from './Viewer.module.css';

const Viewer = ({ artwork, position, total, onPrev, onNext, onClose, copy }) => {
  const panel = useRef(null);
  const handlers = useRef({});
  handlers.current = { onPrev, onNext, onClose };
  const touch = useRef(null);
  const open = !!artwork;

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    const onKey = (e) => {
      if (e.key === 'Escape') handlers.current.onClose();
      if (e.key === 'ArrowLeft') handlers.current.onPrev?.();
      if (e.key === 'ArrowRight') handlers.current.onNext?.();
    };
    document.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    pauseScroll();
    panel.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
      resumeScroll();
      previous?.focus?.();
    };
  }, [open]);

  if (!artwork) return null;

  const title = artwork.title || 'Untitled';
  const meta = artworkMeta(artwork);

  const onTouchStart = (e) => { touch.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touch.current == null) return;
    const dx = e.changedTouches[0].clientX - touch.current;
    touch.current = null;
    if (dx > 60) onPrev?.();
    if (dx < -60) onNext?.();
  };

  return createPortal(
    <div
      ref={panel}
      className={styles.room}
      style={{ '--accent': accentFor(artwork) }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      tabIndex={-1}
      data-lenis-prevent
    >
      <button type="button" className={`${styles.round} ${styles.close}`} onClick={onClose} aria-label="Close">
        <FiX aria-hidden="true" />
      </button>

      <img key={`glow-${artwork.id}`} className={styles.glow} src={artworkSrc(artwork)} alt="" draggable="false" />

      <div className={styles.stage} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <figure key={artwork.id} className={styles.frame}>
          <ArtImage src={artworkSrc(artwork)} alt={title} eager className={styles.image} />
          {artwork.sold && <span className={styles.dot} aria-hidden="true" />}
        </figure>

        {total > 1 && (
          <div className={styles.nav}>
            <button type="button" className={styles.round} onClick={onPrev} aria-label="Previous piece">
              <FiChevronLeft aria-hidden="true" />
            </button>
            <span className={styles.count}>{position} of {total}</span>
            <button type="button" className={styles.round} onClick={onNext} aria-label="Next piece">
              <FiChevronRight aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <aside className={styles.card}>
        <div key={artwork.id} className={styles.cardInner}>
          <h2 className={`${styles.title} art-title`}>{title}</h2>
          {meta && <p className={styles.meta}>{meta}</p>}

          <p className={styles.price}>
            {artwork.sold
              ? <span className={styles.soldTag}>Found a home</span>
              : formatPrice(artwork.price)}
          </p>

          {artwork.description && <p className={styles.description}>{artwork.description}</p>}

          {artwork.sold && <p className={styles.note}>{copy.soldNote}</p>}

          <div className={styles.actions}>
            <Link to={`/contact?piece=${encodeURIComponent(title)}`} className="btn btn-candy">
              {copy.enquire}
            </Link>
            <LikeButton artwork={artwork} />
          </div>

          <p className={styles.policy}>
            {copy.policyNote} <Link to="/policy">{copy.policyLink}</Link>
          </p>

          <div className={styles.rating}>
            <Stars artwork={artwork} prompt={copy.rateLabel} />
            <p className={`${styles.policy} ${styles.votes}`}>
              {copy.votesNote} <Link to="/privacy">Privacy policy</Link>
            </p>
          </div>
        </div>
      </aside>
    </div>,
    document.body,
  );
};

export default Viewer;

import { FaHeart } from 'react-icons/fa';
import ArtImage from '../ArtImage';
import { artworkMeta, artworkSrc, formatPrice } from '../../lib/gallery';
import { accentFor } from '../../lib/palette';
import styles from './ArtworkCard.module.css';

const ArtworkCard = ({ artwork, onOpen, eager = false }) => {
  const title = artwork.title || 'Untitled';
  const likes = artwork.likeCount || 0;
  const meta = artworkMeta(artwork);

  return (
    <article className={styles.card} style={{ '--accent': accentFor(artwork) }}>
      <button
        type="button"
        className={styles.stage}
        onClick={() => onOpen(artwork.id)}
        data-tilt
        data-cursor={artwork.sold ? 'Admire' : 'View'}
        aria-label={`Look closer at ${title}`}
      >
        <span className={styles.wash} aria-hidden="true" />
        <span className={styles.piece}>
          <ArtImage src={artworkSrc(artwork)} alt={title} eager={eager} />
          <span className={styles.sheen} aria-hidden="true" />
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

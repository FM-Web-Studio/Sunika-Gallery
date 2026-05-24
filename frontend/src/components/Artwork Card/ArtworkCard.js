import React from 'react';
import ProtectedImage from '../Protected Image';
import StarRating from '../Star Rating';
import { formatPrice, averageRating } from '../../firebase';
import styles from './ArtworkCard.module.css';

const ArtworkCard = ({ artwork, onOpen }) => {
  const { title, price, sold, imageUrl, ratingCount = 0 } = artwork;
  const avg = averageRating(artwork);

  return (
    <button
      type="button"
      className={styles.card}
      onClick={() => onOpen?.(artwork)}
      aria-label={`View ${title || 'artwork'}`}
    >
      <div className={styles.imageWrap}>
        <ProtectedImage src={imageUrl} alt={title} className={styles.image} />
        {sold && <span className={styles.soldBadge}>Sold</span>}
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{title || 'Untitled'}</h3>
        <p className={styles.price}>{formatPrice(price)}</p>
        <StarRating value={avg} count={ratingCount} size="sm" />
      </div>
    </button>
  );
};

export default ArtworkCard;

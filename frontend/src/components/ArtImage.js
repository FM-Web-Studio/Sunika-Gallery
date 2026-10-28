import { useState } from 'react';
import styles from './ArtImage.module.css';

const block = (e) => e.preventDefault();

const ArtImage = ({ src, alt, className = '', eager = false, sizes }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <span className={`${styles.wrap} ${loaded ? styles.loaded : ''} ${className}`} onContextMenu={block}>
      {src && (
        <img
          src={src}
          alt={alt}
          sizes={sizes}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable="false"
          className={`${styles.img} protected`}
          onLoad={() => setLoaded(true)}
          onDragStart={block}
        />
      )}
      <span className={styles.shield} aria-hidden="true" />
    </span>
  );
};

export default ArtImage;

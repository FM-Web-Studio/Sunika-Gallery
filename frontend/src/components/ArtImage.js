import { useEffect, useRef, useState } from 'react';
import { useSite } from '../context/SiteContext';
import { watermarkUrl } from '../lib/watermark';
import styles from './ArtImage.module.css';

const block = (e) => e.preventDefault();

const ArtImage = ({ src, alt, className = '', eager = false, sizes }) => {
  const [loaded, setLoaded] = useState(false);
  const img = useRef(null);
  const brand = useSite().copy('brand');
  const mark = watermarkUrl(`© ${brand.brandName}`, typeof window === 'undefined' ? '' : window.location.host);

  useEffect(() => {
    if (img.current?.complete && img.current.naturalWidth) setLoaded(true);
  }, [src]);

  return (
    <span className={`${styles.wrap} ${loaded ? styles.loaded : ''} ${className}`} onContextMenu={block}>
      {src && (
        <img
          ref={img}
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
      <span className={styles.shield} style={{ backgroundImage: mark }} aria-hidden="true" />
    </span>
  );
};

export default ArtImage;

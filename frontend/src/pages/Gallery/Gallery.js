import React, { useState, useEffect, useMemo } from 'react';
import { ArtworkCard, CategoryFilter, ArtworkLightbox } from '../../components';
import { subscribeArtworks, CATEGORIES } from '../../firebase';
import Loading from '../Loading';
import styles from './Gallery.module.css';

const FILTERS = ['All', ...CATEGORIES];

const Gallery = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const unsub = subscribeArtworks(
      (items) => { setArtworks(items); setLoading(false); },
      (err)   => { setError(err); setLoading(false); },
    );
    return unsub;
  }, []);

  const filtered = useMemo(
    () => activeCategory === 'All'
      ? artworks
      : artworks.filter(a => a.category === activeCategory),
    [artworks, activeCategory],
  );

  // Keep the open lightbox in sync with live data (e.g. rating updates).
  const selectedLive = selected ? artworks.find(a => a.id === selected.id) || selected : null;

  if (loading) return <Loading message="Loading the gallery" />;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.heading}>Gallery</h1>
        <p className={styles.subtitle}>A collection of original works.</p>
      </header>

      <CategoryFilter
        categories={FILTERS}
        active={activeCategory}
        onChange={setActiveCategory}
      />

      {error && (
        <p className={styles.empty}>Something went wrong loading the gallery.</p>
      )}

      {!error && filtered.length === 0 && (
        <p className={styles.empty}>No pieces in this category yet.</p>
      )}

      <div className={styles.grid}>
        {filtered.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} onOpen={setSelected} />
        ))}
      </div>

      <ArtworkLightbox
        artwork={selectedLive}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
};

export default Gallery;

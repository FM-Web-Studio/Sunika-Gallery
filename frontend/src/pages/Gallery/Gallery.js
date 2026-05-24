import React, { useState, useEffect, useMemo } from 'react';
import { FiSliders } from 'react-icons/fi';
import { ArtworkCard, FilterPanel, ArtworkLightbox } from '../../components';
import { subscribeArtworks, CATEGORIES, averageRating } from '../../firebase';
import Loading from '../Loading';
import styles from './Gallery.module.css';

const CATEGORY_FILTERS = ['All', ...CATEGORIES];

const Gallery = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [status, setStatus] = useState('all');
  const [sort, setSort]     = useState('newest');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const unsub = subscribeArtworks(
      (items) => { setArtworks(items); setLoading(false); },
      (err)   => { setError(err);     setLoading(false); },
    );
    return unsub;
  }, []);

  const filtered = useMemo(() => {
    let list = activeCategory === 'All'
      ? artworks
      : artworks.filter(a => a.category === activeCategory);

    if (status === 'available') list = list.filter(a => !a.sold);
    if (status === 'sold')      list = list.filter(a => a.sold);

    const sorted = [...list];
    switch (sort) {
      case 'oldest':
        sorted.sort((a, b) => (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0));
        break;
      case 'top-rated':
        sorted.sort((a, b) => averageRating(b) - averageRating(a));
        break;
      case 'most-liked':
        sorted.sort((a, b) => (b.likeCount ?? 0) - (a.likeCount ?? 0));
        break;
      case 'price-asc':
        sorted.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
        break;
      case 'price-desc':
        sorted.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        break;
      default:
        sorted.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
    }
    return sorted;
  }, [artworks, activeCategory, status, sort]);

  const selectedLive = selected
    ? artworks.find(a => a.id === selected.id) || selected
    : null;

  const activeFilterCount = (activeCategory !== 'All' ? 1 : 0)
    + (status !== 'all' ? 1 : 0)
    + (sort !== 'newest' ? 1 : 0);

  const handleClear = () => {
    setActiveCategory('All');
    setStatus('all');
    setSort('newest');
  };

  if (loading) return <Loading message="Loading the gallery" />;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.heading}>Gallery</h1>
        <p className={styles.subtitle}>A collection of original works.</p>
      </header>

      <div className={styles.filterBar}>
        <button
          className={`${styles.filterFab} ${activeFilterCount > 0 ? styles.filterFabActive : ''}`}
          onClick={() => setFilterOpen(true)}
          aria-label="Open filters"
        >
          <FiSliders aria-hidden="true" />
          Filters
          {activeFilterCount > 0 && (
            <span className={styles.badge}>{activeFilterCount}</span>
          )}
        </button>
      </div>

      {error && <p className={styles.empty}>Something went wrong loading the gallery.</p>}
      {!error && filtered.length === 0 && <p className={styles.empty}>No pieces match this filter.</p>}

      <div className={styles.grid}>
        {filtered.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} onOpen={setSelected} />
        ))}
      </div>

      <FilterPanel
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        categories={CATEGORY_FILTERS}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        status={status}
        setStatus={setStatus}
        sort={sort}
        setSort={setSort}
        onClear={handleClear}
      />

      <ArtworkLightbox
        artwork={selectedLive}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
};

export default Gallery;

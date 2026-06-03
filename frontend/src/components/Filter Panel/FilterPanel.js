import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './FilterPanel.module.css';

const Section = ({ label, options, value, onChange }) => (
  <div className={styles.section}>
    <span className={styles.sectionLabel}>{label}</span>
    <div className={styles.optionRow}>
      {options.map(({ value: v, label: l }) => (
        <button
          key={v}
          type="button"
          className={`${styles.option} ${value === v ? styles.optionActive : ''}`}
          onClick={() => onChange(v)}
        >
          {l}
        </button>
      ))}
    </div>
  </div>
);

const FilterPanel = ({
  open, onClose,
  activeCategory, setActiveCategory, categories,
  status, setStatus,
  sort, setSort,
  onClear,
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, [open, onClose]);

  if (!open) return null;

  const STATUS_OPTIONS = [
    { value: 'all',       label: 'All' },
    { value: 'available', label: 'Available' },
    { value: 'sold',      label: 'Sold' },
  ];

  const SORT_OPTIONS = [
    { value: 'newest',     label: 'Newest first' },
    { value: 'oldest',     label: 'Oldest first' },
    { value: 'top-rated',  label: 'Top rated' },
    { value: 'most-liked', label: 'Most liked' },
    { value: 'price-asc',  label: 'Price ↑' },
    { value: 'price-desc', label: 'Price ↓' },
  ];

  return createPortal(
    <div className={styles.root}>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <div className={styles.sheet} role="dialog" aria-modal="true" aria-label="Filters">
        <div className={styles.handle} />
        <div className={styles.header}>
          <h2 className={styles.title}>Filters</h2>
          <button className={styles.close} onClick={onClose} aria-label="Close filters">×</button>
        </div>

        <div className={styles.body}>
          <Section
            label="Category"
            options={categories.map(c => ({ value: c, label: c }))}
            value={activeCategory}
            onChange={setActiveCategory}
          />
          <Section
            label="Status"
            options={STATUS_OPTIONS}
            value={status}
            onChange={setStatus}
          />
          <Section
            label="Sort by"
            options={SORT_OPTIONS}
            value={sort}
            onChange={setSort}
          />
        </div>

        <div className={styles.footer}>
          <button className={styles.clearBtn} onClick={onClear}>Clear all</button>
          <button className={styles.doneBtn} onClick={onClose}>Done</button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default FilterPanel;

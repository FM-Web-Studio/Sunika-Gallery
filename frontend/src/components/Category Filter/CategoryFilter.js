import React from 'react';
import styles from './CategoryFilter.module.css';

const CategoryFilter = ({ categories = [], active, onChange }) => (
  <div className={styles.bar} role="tablist" aria-label="Filter by category">
    {categories.map((cat) => (
      <button
        key={cat}
        type="button"
        role="tab"
        aria-selected={active === cat}
        className={`${styles.pill} ${active === cat ? styles.active : ''}`}
        onClick={() => onChange?.(cat)}
      >
        {cat}
      </button>
    ))}
  </div>
);

export default CategoryFilter;

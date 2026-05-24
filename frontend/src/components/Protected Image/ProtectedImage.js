import React from 'react';
import styles from './ProtectedImage.module.css';

/**
 * Renders an image that resists right-click saving, dragging, and long-press.
 * A transparent overlay intercepts pointer events so "Save Image As" never
 * appears on the underlying <img>. Screenshots at OS level cannot be prevented.
 */
const ProtectedImage = ({ src, alt = '', className = '', style, onClick }) => (
  <div
    className={`${styles.wrapper} ${className}`}
    style={style}
    onClick={onClick}
  >
    <img
      src={src}
      alt={alt}
      draggable={false}
      className={styles.image}
    />
    <div
      className={styles.overlay}
      onContextMenu={e => e.preventDefault()}
      aria-hidden="true"
    />
  </div>
);

export default ProtectedImage;

import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';
import { FiMoreVertical } from 'react-icons/fi';
import styles from './KebabMenu.module.css';

// ─── COMPONENT ────────────────────────────────────────────────────────────────
// Three-dot overflow menu. Renders a trigger button and, when open, a small
// action popover portalled to <body> (so it never clips inside scroll/overflow
// containers) and anchored to the trigger.
//
//   items: [{ label, icon?, onClick, danger?, disabled? }]
const KebabMenu = ({ items = [], label = 'More actions', align = 'right' }) => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const menuId = useId();

  const close = useCallback(() => setOpen(false), []);

  const place = useCallback(() => {
    const r = triggerRef.current?.getBoundingClientRect();
    if (!r) return;
    setCoords({
      top: r.bottom + 8,
      // Anchor the chosen edge of the menu to the matching edge of the trigger.
      left: align === 'right' ? r.right : r.left,
    });
  }, [align]);

  const toggle = () => {
    if (!open) place();
    setOpen((o) => !o);
  };

  // Close on outside click, Escape, scroll or resize.
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (
        !menuRef.current?.contains(e.target) &&
        !triggerRef.current?.contains(e.target)
      ) close();
    };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    const onReflow = () => close();

    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onReflow, true);
    window.addEventListener('resize', onReflow);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onReflow, true);
      window.removeEventListener('resize', onReflow);
    };
  }, [open, close]);

  const run = (item) => {
    close();
    item.onClick?.();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.trigger} ${open ? styles.triggerOpen : ''}`}
        onClick={toggle}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
      >
        <FiMoreVertical aria-hidden="true" />
      </button>

      {open && coords && createPortal(
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          className={`${styles.menu} ${align === 'right' ? styles.alignRight : styles.alignLeft}`}
          style={{ top: coords.top, left: coords.left }}
        >
          {items.map((item, i) => (
            <button
              key={i}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              className={`${styles.item} ${item.danger ? styles.itemDanger : ''}`}
              onClick={() => run(item)}
            >
              {item.icon && <span className={styles.itemIcon} aria-hidden="true">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>,
        document.body,
      )}
    </>
  );
};

export default KebabMenu;

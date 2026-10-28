import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';
import { pauseScroll, resumeScroll } from '../hooks/useMomentumScroll';
import styles from './Modal.module.css';

const Modal = ({ open, onClose, title, size = 'md', children }) => {
  const panel = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    const onKey = (e) => { if (e.key === 'Escape') closeRef.current(); };
    document.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    pauseScroll();
    panel.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
      resumeScroll();
      previous?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className={styles.backdrop} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        ref={panel}
        className={`${styles.panel} ${styles[size]}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        data-lenis-prevent
      >
        <header className={styles.head}>
          <h2>{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <FiX aria-hidden="true" />
          </button>
        </header>
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;

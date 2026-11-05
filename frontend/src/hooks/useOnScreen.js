import { useEffect, useState } from 'react';

const observers = new Map();

const watch = (el, margin, fn) => {
  if (typeof IntersectionObserver === 'undefined') {
    fn(true);
    return () => {};
  }
  let entry = observers.get(margin);
  if (!entry) {
    const listeners = new Map();
    const io = new IntersectionObserver((items) => {
      items.forEach((it) => listeners.get(it.target)?.(it.isIntersecting));
    }, { rootMargin: margin });
    entry = { io, listeners };
    observers.set(margin, entry);
  }
  entry.listeners.set(el, fn);
  entry.io.observe(el);
  return () => {
    entry.io.unobserve(el);
    entry.listeners.delete(el);
  };
};

export const useOnScreen = ({ margin = '0px', enabled = true } = {}) => {
  const [el, setEl] = useState(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!enabled || !el) return undefined;
    return watch(el, margin, setOn);
  }, [el, margin, enabled]);

  return [setEl, on];
};

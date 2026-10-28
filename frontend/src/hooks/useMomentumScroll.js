import { useEffect } from 'react';
import Lenis from 'lenis';

let instance = null;

export const scrollToTop = (immediate = true) => {
  if (instance) instance.scrollTo(0, { immediate });
  else window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' });
};

export const pauseScroll = () => instance?.stop();
export const resumeScroll = () => instance?.start();

export const useMomentumScroll = (enabled) => {
  useEffect(() => {
    if (!enabled) return undefined;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
    instance = lenis;
    let frame = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    });
    const resize = new ResizeObserver(() => lenis.resize());
    resize.observe(document.body);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      lenis.destroy();
      if (instance === lenis) instance = null;
    };
  }, [enabled]);
};

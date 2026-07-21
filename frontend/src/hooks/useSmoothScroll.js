import { useEffect } from 'react';
import Lenis from 'lenis';

// ─── HOOK ────────────────────────────────────────────────────────────────────
// Inertial (momentum) smooth-scroll powered by Lenis.
//
// Design decisions:
//  • Wheel/trackpad is smoothed; touch stays NATIVE (no syncTouch) so mobile
//    keeps its expected fling behaviour and never feels laggy.
//  • Fully disabled when the OS requests reduced motion OR the user flips the
//    in-app "Motion" toggle (which sets data-no-animations on <html>). A
//    MutationObserver keeps Lenis in sync if that toggle changes at runtime.
//  • Cleans up its rAF loop + instance on unmount.
export const useSmoothScroll = () => {
  useEffect(() => {
    const root = document.documentElement;
    const mqReduce = window.matchMedia?.('(prefers-reduced-motion: reduce)');

    let lenis = null;
    let rafId = null;

    const shouldRun = () =>
      !mqReduce?.matches && root.getAttribute('data-no-animations') !== 'true';

    const start = () => {
      if (lenis) return;
      lenis = new Lenis({
        // lerp-based (not duration-based) smoothing: the scroll position eases
        // toward the target a fraction each frame, so fast flicks glide with
        // continuous momentum instead of re-targeting in visible jumps. Lower
        // lerp = heavier/slower settle, giving images more time to load in.
        lerp: 0.07,
        smoothWheel: true,
        wheelMultiplier: 0.85,
        // Keep a gentle eased duration for programmatic scrollTo (anchors, etc.).
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      const raf = (time) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
      // Exposed so route changes (ScrollToTop) can jump without a Lenis glide.
      window.__lenis = lenis;
    };

    const stop = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      lenis?.destroy();
      lenis = null;
      if (window.__lenis) delete window.__lenis;
    };

    const sync = () => (shouldRun() ? start() : stop());

    sync();

    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ['data-no-animations'] });
    mqReduce?.addEventListener?.('change', sync);

    return () => {
      observer.disconnect();
      mqReduce?.removeEventListener?.('change', sync);
      stop();
    };
  }, []);
};

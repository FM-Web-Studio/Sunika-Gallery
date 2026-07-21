import React, { Suspense, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Routes, Route, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { NotFound, Loading, Gallery, Contact, Admin } from './pages';
import { Settings, ToastProvider, BotanicalBackground } from './components';
import { useTheme, useAnimations, useSmoothScroll } from './hooks';
import styles from './App.module.css';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    // Jump instantly on navigation — hand off to Lenis when it's active so the
    // internal scroll position stays in sync and doesn't glide back.
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Floating page toggle — docked bottom-centre, clear of the top toolbar.
// A small hint + destination label with a directional arrow.
const PageNavBubble = () => {
  const navigate     = useNavigate();
  const { pathname } = useLocation();
  const toContact    = pathname === '/';
  const label        = toContact ? 'Contact' : 'Gallery';
  const hint         = toContact ? 'Get in touch' : 'Back to';
  const ariaLabel    = toContact ? 'Go to Contact' : 'Go to Gallery';

  return (
    <button
      type="button"
      className={`${styles.navPill} ${toContact ? styles.navForward : styles.navBack}`}
      onClick={() => navigate(toContact ? '/contact' : '/')}
      aria-label={ariaLabel}
    >
      {!toContact && <FiArrowLeft className={styles.navArrow} aria-hidden="true" />}
      <span className={styles.navText}>
        <span className={styles.navHint}>{hint}</span>
        <span className={styles.navLabel}>{label}</span>
      </span>
      {toContact  && <FiArrowRight className={styles.navArrow} aria-hidden="true" />}
    </button>
  );
};

// Two independent docks: settings cog top-right, page toggle bottom-centre.
const FloatingControls = ({ theme, toggleTheme }) => createPortal(
  <>
    <div className={styles.settingsDock}>
      <Settings theme={theme} toggleTheme={toggleTheme} />
    </div>
    <div className={styles.navDock}>
      <PageNavBubble />
    </div>
  </>,
  document.body
);

const AppLayout = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.app}>
      <BotanicalBackground />
      <FloatingControls theme={theme} toggleTheme={toggleTheme} />

      <div key={location.pathname} className={styles.pageContent}>
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

const AppContent = () => (
  <>
    <ScrollToTop />
    <Routes>
      <Route path="/admin" element={<Admin />} />
      <Route path="/" element={<AppLayout />}>
        <Route index           element={<Gallery />} />
        <Route path="contact"  element={<Contact />} />
        <Route path="loading"  element={<Loading />} />
        <Route path="*"        element={<NotFound />} />
      </Route>
    </Routes>
  </>
);

const App = () => {
  useTheme();
  useAnimations();
  useSmoothScroll();
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;

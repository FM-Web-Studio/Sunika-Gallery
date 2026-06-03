import React, { Suspense, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Routes, Route, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiMail } from 'react-icons/fi';
import { NotFound, Loading, Gallery, Contact, Admin } from './pages';
import { Settings, ToastProvider } from './components';
import { useTheme, useAnimations } from './hooks';
import styles from './App.module.css';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// Navigates between Gallery and Contact — always shows the *other* page.
const PageNavBubble = () => {
  const navigate     = useNavigate();
  const { pathname } = useLocation();
  const toContact    = pathname === '/';
  const Icon         = toContact ? FiMail : FiGrid;
  const label        = toContact ? 'Go to Contact' : 'Go to Gallery';

  return (
    <button
      type="button"
      className={styles.navBubble}
      onClick={() => navigate(toContact ? '/contact' : '/')}
      aria-label={label}
      title={label}
    >
      <Icon />
    </button>
  );
};

// Single portal anchor — both buttons share one fixed position so they
// are always perfectly aligned regardless of screen size.
const FloatingControls = ({ theme, toggleTheme }) => createPortal(
  <div className={styles.floatingControls}>
    <PageNavBubble />
    <Settings theme={theme} toggleTheme={toggleTheme} />
  </div>,
  document.body
);

const AppLayout = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.app}>
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
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;

import { lazy, Suspense, useEffect } from 'react';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Loading from './components/Loading';
import ErrorBoundary from './components/ErrorBoundary';
import { usePrefs } from './hooks/usePrefs';
import { useMomentumScroll, scrollToTop } from './hooks/useMomentumScroll';
import styles from './App.module.css';

const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Policy = lazy(() => import('./pages/Policy'));
const Admin = lazy(() => import('./admin/Admin'));

const PublicLayout = () => {
  const { pathname } = useLocation();
  const { reduceMotion } = usePrefs();
  useMomentumScroll(!reduceMotion);

  useEffect(() => { scrollToTop(); }, [pathname]);

  return (
    <div className={styles.app}>
      <a href="#main" className={styles.skip}>Skip to the artwork</a>
      <Header />
      <main id="main" className={`${styles.main} ${pathname === '/' ? '' : styles.offset}`}>
        <ErrorBoundary resetKey={pathname}>
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

const App = () => (
  <Suspense fallback={<Loading />}>
    <Routes>
      <Route path="/admin" element={<ErrorBoundary><Admin /></ErrorBoundary>} />
      <Route element={<PublicLayout />}>
        <Route index element={<Gallery />} />
        <Route path="contact" element={<Contact />} />
        <Route path="policy" element={<Policy />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </Suspense>
);

export default App;

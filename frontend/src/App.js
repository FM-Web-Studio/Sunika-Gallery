import { Suspense, useEffect } from 'react';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Loading from './components/Loading';
import ErrorBoundary from './components/ErrorBoundary';
import { usePrefs } from './hooks/usePrefs';
import { scrollToTop } from './hooks/scroll';
import { useInteractions } from './hooks/useInteractions';
import { useIntro } from './hooks/useIntro';
import { Gallery, Contact, NotFound, Policy, Privacy, Terms, Admin } from './pages';
import styles from './App.module.css';


const PublicLayout = () => {
  const { pathname } = useLocation();
  const { reduceMotion } = usePrefs();
  useInteractions(!reduceMotion);
  useIntro(pathname !== '/');

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
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </Suspense>
);

export default App;

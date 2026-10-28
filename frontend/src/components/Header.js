import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FiMoon, FiSun, FiZap, FiZapOff } from 'react-icons/fi';
import { usePrefs } from '../hooks/usePrefs';
import { LOGOS } from '../lib/logos';
import { useSite } from '../context/SiteContext';
import styles from './Header.module.css';

const LINKS = [
  { to: '/', label: 'Collection', end: true },
  { to: '/contact', label: 'Contact' },
];

const Header = () => {
  const { theme, toggleTheme, reduceMotion, toggleMotion } = usePrefs();
  const { copy } = useSite();
  const brand = copy('brand');
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let queued = false;
    const measure = () => { queued = false; setScrolled(window.scrollY > window.innerHeight * 0.6); };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const overHero = pathname === '/' && !scrolled;

  return (
    <header className={`${styles.bar} ${overHero ? styles.overHero : styles.solid}`}>
      <nav className={styles.nav} aria-label="Main">
        {LINKS.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
            {l.label}
          </NavLink>
        ))}
      </nav>

      <Link to="/" className={styles.brand} aria-label={`${brand.brandName} gallery home`}>
        <img src={LOGOS.mark} alt="" className={styles.mark} width="64" height="60" />
      </Link>

      <div className={styles.tools}>
        <button
          type="button"
          className={styles.tool}
          onClick={toggleMotion}
          aria-pressed={reduceMotion}
          aria-label={reduceMotion ? 'Turn animations on' : 'Turn animations off'}
          title={reduceMotion ? 'Turn animations on' : 'Turn animations off'}
        >
          {reduceMotion ? <FiZapOff aria-hidden="true" /> : <FiZap aria-hidden="true" />}
        </button>
        <button
          type="button"
          className={styles.tool}
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
        </button>
        <Link to="/contact" className={styles.enquire}>Enquire</Link>
      </div>
    </header>
  );
};

export default Header;

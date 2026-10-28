import { Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import SocialLinks from './SocialLinks';
import { LOGOS } from '../lib/logos';
import styles from './Footer.module.css';

const Footer = () => {
  const { copy, contact } = useSite();
  const brand = copy('brand');

  return (
    <footer className={styles.footer}>
      <div className={styles.cta}>
        <p className={styles.ctaLine}>{brand.footerCta}</p>
        <Link to="/contact" className={`btn btn-candy ${styles.ctaBtn}`}>{brand.footerButton}</Link>
      </div>

      <div className={styles.inner}>
        <div className={styles.lead}>
          <img src={LOGOS.wordmark} alt={brand.brandName} className={styles.wordmark} loading="lazy" />
          <p>{brand.footerLine}</p>
        </div>

        <div className={styles.side}>
          <nav className={styles.links} aria-label="Footer">
            <Link to="/">Collection</Link>
            <Link to="/contact">Contact</Link>
            {brand.portfolioUrl && (
              <a href={brand.portfolioUrl} target="_blank" rel="noopener noreferrer">{brand.portfolioLabel}</a>
            )}
          </nav>
          <SocialLinks socials={contact.socials} compact />
        </div>
      </div>

      <p className={styles.small}>&copy; {new Date().getFullYear()} {brand.brandName}. Every artwork on this site is protected by copyright.</p>
    </footer>
  );
};

export default Footer;

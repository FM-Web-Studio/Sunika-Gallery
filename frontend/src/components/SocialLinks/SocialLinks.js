import { FaInstagram, FaLinkedinIn, FaFacebookF, FaBehance, FaDribbble, FaTiktok, FaWhatsapp, FaPinterestP, FaGlobe, FaEnvelope, FaLink } from 'react-icons/fa';
import styles from './SocialLinks.module.css';

const ICONS = {
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  facebook: FaFacebookF,
  behance: FaBehance,
  dribbble: FaDribbble,
  tiktok: FaTiktok,
  pinterest: FaPinterestP,
  whatsapp: FaWhatsapp,
  website: FaGlobe,
  email: FaEnvelope,
};

const titleCase = (s = '') => s.charAt(0).toUpperCase() + s.slice(1);

const SocialLinks = ({ socials = [], compact = false }) => {
  const items = socials.filter((s) => s?.url);
  if (!items.length) return null;

  return (
    <ul className={`${styles.list} ${compact ? styles.compact : ''}`}>
      {items.map((s, i) => {
        const key = (s.key || '').toLowerCase();
        const Icon = ICONS[key] || FaLink;
        const label = s.label || titleCase(key) || 'Link';
        const external = !s.url.startsWith('mailto:');
        return (
          <li key={`${key}-${i}`}>
            <a
              className={styles.link}
              href={s.url}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              aria-label={compact ? label : undefined}
              data-key={key}
            >
              <span className={styles.icon}><Icon aria-hidden="true" /></span>
              {!compact && <span>{label}</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SocialLinks;

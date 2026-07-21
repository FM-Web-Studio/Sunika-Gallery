import React from 'react';
import {
  FaInstagram, FaFacebookF, FaWhatsapp, FaTiktok, FaLinkedinIn, FaLink,
} from 'react-icons/fa';
import { FiMail, FiPhone, FiMapPin, FiArrowUpRight } from 'react-icons/fi';
import Modal from '../Modal';
import styles from './ContactPopup.module.css';

const SOCIAL_ICONS = {
  instagram: FaInstagram,
  facebook:  FaFacebookF,
  whatsapp:  FaWhatsapp,
  tiktok:    FaTiktok,
  linkedin:  FaLinkedinIn,
};

const prettyType = (type = '') => type.charAt(0).toUpperCase() + type.slice(1);

// Assemble a single ordered list of contact methods from site settings.
const buildMethods = (settings = {}) => {
  const methods = [];

  if (settings.email) {
    methods.push({
      key: 'email', Icon: FiMail, label: 'Email', value: settings.email,
      href: `mailto:${settings.email}`,
    });
  }
  if (settings.phone) {
    methods.push({
      key: 'phone', Icon: FiPhone, label: 'Call', value: settings.phone,
      href: `tel:${settings.phone.replace(/\s/g, '')}`,
    });
  }
  (settings.socials || []).forEach((s) => {
    methods.push({
      key: s.label || s.type,
      Icon: SOCIAL_ICONS[s.type] || FaLink,
      label: s.label || prettyType(s.type),
      value: prettyType(s.type),
      href: s.href,
      external: true,
    });
  });
  if (settings.location) {
    methods.push({
      key: 'location', Icon: FiMapPin, label: 'Studio', value: settings.location,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.location)}`,
      external: true,
    });
  }

  return methods;
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────
// Modern "contact card" popup — each way to reach out is a large tactile button.
const ContactPopup = ({ open, onClose, settings }) => {
  const methods = buildMethods(settings);

  return (
    <Modal open={open} onClose={onClose} title="Get in touch">
      <p className={styles.intro}>Reach out however suits you best.</p>

      <div className={styles.methods}>
        {methods.map(({ key, Icon, label, value, href, external }) => (
          <a
            key={key}
            href={href}
            className={styles.method}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            <span className={styles.badge} aria-hidden="true"><Icon /></span>
            <span className={styles.text}>
              <span className={styles.label}>{label}</span>
              <span className={styles.value}>{value}</span>
            </span>
            <FiArrowUpRight className={styles.arrow} aria-hidden="true" />
          </a>
        ))}

        {methods.length === 0 && (
          <p className={styles.empty}>Contact details are being updated — please check back soon.</p>
        )}
      </div>
    </Modal>
  );
};

export default ContactPopup;

import React from 'react';
import { FaInstagram, FaFacebookF, FaWhatsapp, FaTiktok, FaEnvelope, FaLinkedinIn, FaLink } from 'react-icons/fa';
import styles from './SocialLinks.module.css';

const ICONS = {
  instagram: FaInstagram,
  facebook:  FaFacebookF,
  whatsapp:  FaWhatsapp,
  tiktok:    FaTiktok,
  linkedin:  FaLinkedinIn,
  email:     FaEnvelope,
};

const SocialLinks = ({ socials = [] }) => (
  <div className={styles.links}>
    {socials.map(({ type, label, href }) => {
      const Icon = ICONS[type] || FaLink;
      const isEmail = type === 'email' || href.startsWith('mailto:');
      return (
        <a
          key={label}
          href={href}
          className={styles.link}
          aria-label={label}
          {...(isEmail ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
        >
          <Icon aria-hidden="true" />
          <span>{label}</span>
        </a>
      );
    })}
  </div>
);

export default SocialLinks;

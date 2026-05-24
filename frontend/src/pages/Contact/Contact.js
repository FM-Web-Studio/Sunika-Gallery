import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { ContactForm, SocialLinks } from '../../components';
import { subscribeSiteSettings, DEFAULT_SETTINGS } from '../../firebase';
import styles from './Contact.module.css';

const Contact = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => subscribeSiteSettings(setSettings, () => {}), []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.heading}>Get in touch</h1>
        <p className={styles.subtitle}>
          Interested in a piece or a commission? Send a message or reach out on socials.
        </p>
      </header>

      <div className={styles.layout}>
        <section className={styles.formSection}>
          <ContactForm />
        </section>

        <aside className={styles.socialSection}>
          <h2 className={styles.socialHeading}>Find me online</h2>
          <SocialLinks socials={settings.socials} />

          <ul className={styles.details}>
            {settings.email && (
              <li>
                <FaEnvelope aria-hidden="true" />
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </li>
            )}
            {settings.phone && (
              <li>
                <FaPhone aria-hidden="true" />
                <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a>
              </li>
            )}
            {settings.location && (
              <li>
                <FaMapMarkerAlt aria-hidden="true" />
                <span>{settings.location}</span>
              </li>
            )}
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default Contact;

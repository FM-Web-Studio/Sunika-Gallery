import React, { useState, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import { ContactForm, SocialLinks, ContactPopup } from '../../components';
import { subscribeSiteSettings, DEFAULT_SETTINGS } from '../../firebase';
import { useReveal } from '../../hooks';
import styles from './Contact.module.css';

const Contact = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => subscribeSiteSettings(setSettings, () => {}), []);
  useReveal([]);

  return (
    <div className={styles.page}>
      <header className={styles.header} data-reveal>
        <span className={styles.overline}>Sunika · Contact</span>
        <h1 className={styles.heading}>Get in touch</h1>
        <p className={styles.subtitle}>
          Interested in a piece or a commission? Send a message below, or open the
          contact card to reach me directly.
        </p>
      </header>

      <div className={styles.layout}>
        <section className={styles.formSection} data-reveal style={{ '--reveal-delay': '0.08s' }}>
          <ContactForm />
        </section>

        <aside className={styles.socialSection} data-reveal style={{ '--reveal-delay': '0.16s' }}>
          <h2 className={styles.socialHeading}>Reach me directly</h2>
          <p className={styles.socialText}>
            Prefer email, a call, or a message on socials? Open the contact card for
            every way to get in touch.
          </p>

          <button type="button" className={styles.ctaBtn} onClick={() => setPopupOpen(true)}>
            <FiSend aria-hidden="true" />
            Get in touch
          </button>

          <div className={styles.divider} aria-hidden="true" />

          <span className={styles.findLabel}>Find me online</span>
          <SocialLinks socials={settings.socials} />
        </aside>
      </div>

      <ContactPopup open={popupOpen} onClose={() => setPopupOpen(false)} settings={settings} />
    </div>
  );
};

export default Contact;

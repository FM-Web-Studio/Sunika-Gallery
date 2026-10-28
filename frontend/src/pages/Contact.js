import { useSearchParams } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import ContactForm from '../components/ContactForm';
import SocialLinks from '../components/SocialLinks';
import { useSite } from '../context/SiteContext';
import { fillTemplate } from '../lib/gallery';
import styles from './Contact.module.css';

const Contact = () => {
  const { copy, contact } = useSite();
  const t = copy('contactPage');
  const [params] = useSearchParams();
  const piece = (params.get('piece') || '').slice(0, 200);
  const initialMessage = piece ? fillTemplate(t.pieceMessage, { title: piece }) : '';

  const details = [
    contact.email && { icon: FiMail, label: contact.email, href: `mailto:${contact.email}` },
    contact.phone && { icon: FiPhone, label: contact.phone, href: `tel:${contact.phone.replace(/[^\d+]/g, '')}` },
    contact.location && { icon: FiMapPin, label: contact.location },
  ].filter(Boolean);

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <h1 className={styles.heading}>{t.heading}</h1>
        <p className={styles.intro}>{t.intro}</p>
      </header>

      <div className={styles.layout}>
        <section className={styles.formCard} aria-labelledby="contact-form-title">
          <h2 id="contact-form-title" className={styles.cardTitle}>{t.formHeading}</h2>
          <ContactForm key={piece} initialMessage={initialMessage} sentText={t.sent} />
        </section>

        {(details.length > 0 || contact.socials.length > 0) && (
          <aside className={styles.aside}>
            <h2 className={styles.cardTitle}>{t.detailsHeading}</h2>
            {details.length > 0 && (
              <ul className={styles.details}>
                {details.map(({ icon: Icon, label, href }) => (
                  <li key={label}>
                    <span className={styles.detailIcon}><Icon aria-hidden="true" /></span>
                    {href ? <a href={href}>{label}</a> : <span>{label}</span>}
                  </li>
                ))}
              </ul>
            )}
            <SocialLinks socials={contact.socials} />
          </aside>
        )}
      </div>
    </div>
  );
};

export default Contact;

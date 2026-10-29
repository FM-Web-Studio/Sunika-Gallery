import { Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import { usePageMeta } from '../hooks/usePageMeta';
import styles from './Policy.module.css';

const Policy = () => {
  const t = useSite().copy('policy');
  usePageMeta({ title: t.heading, description: t.intro });

  const sections = [
    [t.finalTitle, t.finalBody],
    [t.rightsTitle, t.rightsBody],
    [t.coloursTitle, t.coloursBody],
    [t.deliveryTitle, t.deliveryBody],
    [t.commissionsTitle, t.commissionsBody],
    [t.copyrightTitle, t.copyrightBody],
  ];

  return (
    <article className={styles.page}>
      <header className={styles.head}>
        <h1 className={styles.heading}>{t.heading}</h1>
        <p className={styles.intro}>{t.intro}</p>
      </header>

      <div className={styles.sections}>
        {sections.map(([title, body], i) => (
          <section key={title} className={`${styles.section} ${i === 0 ? styles.lead : ''}`}>
            <h2>{title}</h2>
            <p>{body}</p>
          </section>
        ))}
      </div>

      <p className={styles.full}>
        This is the short version. The <Link to="/terms">terms of use</Link> and <Link to="/privacy">privacy policy</Link> set out the details.
      </p>

      <p className={styles.questions}>
        {t.questions} <Link to="/contact" className="btn btn-candy">Contact me</Link>
      </p>
    </article>
  );
};

export default Policy;

import { Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import styles from './NotFound.module.css';

const NotFound = () => {
  const t = useSite().copy('notFound');

  return (
    <div className={styles.page}>
      <div className={styles.hook} aria-hidden="true">
        <span className={styles.nail} />
        <span className={styles.outline} />
      </div>
      <h1 className={styles.heading}>{t.heading}</h1>
      <p className={styles.body}>{t.body}</p>
      <Link to="/" className="btn btn-candy">{t.cta}</Link>
    </div>
  );
};

export default NotFound;

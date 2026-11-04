import styles from './Marquee.module.css';

const Marquee = ({ text }) => {
  const items = text.split(',').map((s) => s.trim()).filter(Boolean);
  if (!items.length) return null;

  const row = (hidden) => (
    <ul className={styles.row} aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={i}>
          <span>{item}</span>
          <svg className={styles.star} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0c.9 6.6 4.9 10.8 12 12-7.1 1.2-11.1 5.4-12 12-.9-6.6-4.9-10.8-12-12C7.1 10.8 11.1 6.6 12 0Z" />
          </svg>
        </li>
      ))}
    </ul>
  );

  return (
    <div className={styles.band}>
      <div className={styles.track}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
};

export default Marquee;

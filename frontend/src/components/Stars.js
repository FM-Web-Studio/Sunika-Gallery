import { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { averageRating, getMyRating, rateArtwork } from '../firebase/ratings';
import { useToast } from './Toast';
import styles from './Stars.module.css';

const VALUES = [1, 2, 3, 4, 5];
const WORDS = ['', 'Not for me', 'It is nice', 'I like it', 'I love it', 'I need it'];

const Stars = ({ artwork, prompt }) => {
  const { notify } = useToast();
  const [mine, setMine] = useState(() => getMyRating(artwork.id));
  const [hover, setHover] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => { setMine(getMyRating(artwork.id)); setHover(0); }, [artwork.id]);

  const avg = averageRating(artwork);
  const count = artwork.ratingCount || 0;
  const shown = hover || mine;

  const rate = async (value) => {
    if (mine || busy) return;
    setBusy(true);
    setMine(value);
    try {
      await rateArtwork(artwork.id, value);
      notify('success', 'Thanks, your rating is in.');
    } catch (err) {
      if (err.code === 'already-rated') {
        setMine(getMyRating(artwork.id));
        notify('info', err.message);
      } else {
        setMine(0);
        notify('error', err.code === 'visitor-auth-disabled' ? err.message : 'Your rating did not save. Try again in a moment.');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <p className={styles.prompt}>{mine ? 'Your rating' : prompt}</p>
      <div className={styles.row} role="radiogroup" aria-label="Rate this piece" onMouseLeave={() => setHover(0)}>
        {VALUES.map((v) => (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={mine === v}
            aria-label={`${v} ${v === 1 ? 'star' : 'stars'}, ${WORDS[v]}`}
            className={`${styles.star} ${v <= shown ? styles.on : ''}`}
            onMouseEnter={() => !mine && setHover(v)}
            onFocus={() => !mine && setHover(v)}
            onBlur={() => setHover(0)}
            onClick={() => rate(v)}
            disabled={!!mine || busy}
          >
            <FaStar aria-hidden="true" />
          </button>
        ))}
        <span className={styles.word} aria-hidden="true">{WORDS[shown]}</span>
      </div>
      <p className={styles.summary}>
        {count > 0
          ? `${avg.toFixed(1)} out of 5 from ${count} ${count === 1 ? 'visitor' : 'visitors'}`
          : 'No ratings yet. Be the first.'}
      </p>
    </div>
  );
};

export default Stars;

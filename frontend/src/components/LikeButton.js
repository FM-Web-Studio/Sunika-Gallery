import { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { hasLiked, toggleLike } from '../firebase/likes';
import { useToast } from './Toast';
import styles from './LikeButton.module.css';

const BURST = [0, 1, 2, 3, 4, 5];

const LikeButton = ({ artwork }) => {
  const { notify } = useToast();
  const [liked, setLiked] = useState(() => hasLiked(artwork.id));
  const [busy, setBusy] = useState(false);
  const [pop, setPop] = useState(0);

  useEffect(() => { setLiked(hasLiked(artwork.id)); }, [artwork.id]);

  const count = artwork.likeCount || 0;

  const onClick = async () => {
    if (busy) return;
    setBusy(true);
    const next = !liked;
    setLiked(next);
    if (next) setPop((p) => p + 1);
    try {
      setLiked(await toggleLike(artwork.id));
    } catch (err) {
      setLiked(!next);
      notify('error', err.code === 'visitor-auth-disabled' ? err.message : 'That heart did not stick. Try again in a moment.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      className={`${styles.btn} ${liked ? styles.liked : ''}`}
      onClick={onClick}
      aria-pressed={liked}
      disabled={busy}
    >
      <span className={styles.heart}>
        {liked ? <FaHeart aria-hidden="true" key={pop} className={styles.pop} /> : <FaRegHeart aria-hidden="true" />}
        {liked && pop > 0 && (
          <span key={`b${pop}`} className={styles.burst} aria-hidden="true">
            {BURST.map((i) => <i key={i} style={{ '--a': `${i * 60}deg` }} />)}
          </span>
        )}
      </span>
      <span>{liked ? 'Loved' : 'Love it'}</span>
      <span className={styles.count}>{count}</span>
    </button>
  );
};

export default LikeButton;

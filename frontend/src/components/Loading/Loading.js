import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './Loading.module.css';

const VERSES = [
  { text: 'Wait for the LORD; be strong and take heart and wait for the LORD.', ref: 'Psalm 27:14' },
  { text: 'Be still before the LORD and wait patiently for him.', ref: 'Psalm 37:7' },
  { text: 'The LORD is good to those whose hope is in him, to the one who seeks him.', ref: 'Lamentations 3:25' },
  { text: 'But those who hope in the LORD will renew their strength.', ref: 'Isaiah 40:31' },
  { text: 'Trust in the LORD with all your heart and lean not on your own understanding.', ref: 'Proverbs 3:5' },
  { text: 'For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you.', ref: 'Jeremiah 29:11' },
  { text: 'Be still, and know that I am God.', ref: 'Psalm 46:10' },
  { text: 'Cast all your anxiety on him because he cares for you.', ref: '1 Peter 5:7' },
  { text: 'The LORD will fight for you; you need only to be still.', ref: 'Exodus 14:14' },
  { text: 'He will cover you with his feathers, and under his wings you will find refuge.', ref: 'Psalm 91:4' },
];

const Loading = ({ message = 'Hanging the pictures', showVerse = true }) => {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * VERSES.length));

  useEffect(() => {
    if (!showVerse) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % VERSES.length), 7000);
    return () => clearInterval(timer);
  }, [showVerse]);

  const verse = VERSES[index];

  const overlay = (
    <div className={styles.wrap} role="status" aria-live="polite">
      <div className={styles.frames} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p className={styles.message}>{message}</p>
      {showVerse && (
        <blockquote key={index} className={styles.verse}>
          <p className="art-title">{verse.text}</p>
          <cite>{verse.ref}</cite>
        </blockquote>
      )}
    </div>
  );

  return typeof document === 'undefined' ? overlay : createPortal(overlay, document.body);
};

export default Loading;

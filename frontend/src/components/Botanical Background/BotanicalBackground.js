import React from 'react';
import {
  GiFern, GiVineLeaf, GiLeafSwirl, GiThreeLeaves, GiFallingLeaf, GiOakLeaf,
} from 'react-icons/gi';
import styles from './BotanicalBackground.module.css';

// ─── COMPONENT ────────────────────────────────────────────────────────────────
// Whisper-faint botanical motifs fixed behind the page content. Purely
// decorative: aria-hidden, pointer-events:none, and driven entirely by CSS so
// the reduce-motion / Motion-toggle rules switch off the drift automatically.
const LEAVES = [
  { Icon: GiFern,        cls: 'leafA' },
  { Icon: GiVineLeaf,    cls: 'leafB' },
  { Icon: GiLeafSwirl,   cls: 'leafC' },
  { Icon: GiThreeLeaves, cls: 'leafD' },
  { Icon: GiFallingLeaf, cls: 'leafE' },
  { Icon: GiOakLeaf,     cls: 'leafF' },
];

const BotanicalBackground = () => (
  <div className={styles.canvas} aria-hidden="true">
    {LEAVES.map(({ Icon, cls }) => (
      <Icon key={cls} className={`${styles.leaf} ${styles[cls]}`} />
    ))}
  </div>
);

export default BotanicalBackground;

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import ArtworkCard from '../components/ArtworkCard';
import CursorBubble from '../components/CursorBubble';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import Viewer from '../components/Viewer';
import { subscribeArtworks } from '../firebase/artworks';
import { CATEGORIES } from '../firebase/config';
import { ALL, SORTS, STATUSES, fillTemplate, filterArtworks, galleryStats } from '../lib/gallery';
import { useSite } from '../context/SiteContext';
import styles from './Gallery.module.css';

const CATEGORY_FILTERS = [ALL, ...CATEGORIES];
const FEATURED = 8;

const featuredFrom = (list) => {
  const available = list.filter((a) => !a.sold);
  return [...available, ...list.filter((a) => a.sold)].slice(0, Math.max(FEATURED, 0));
};

const Gallery = () => {
  const { copy } = useSite();
  const t = copy('gallery');
  const viewerCopy = copy('viewer');
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const category = CATEGORY_FILTERS.includes(params.get('category')) ? params.get('category') : ALL;
  const status = STATUSES.some((s) => s.value === params.get('status')) ? params.get('status') : 'all';
  const sort = SORTS.some((s) => s.value === params.get('sort')) ? params.get('sort') : 'curated';
  const pieceId = params.get('piece');

  useEffect(() => subscribeArtworks(
    (items) => { setArtworks(items); setLoading(false); setFailed(false); },
    (err) => { console.error('The gallery could not load.', err); setFailed(true); setLoading(false); },
  ), []);

  const update = useCallback((patch, { replace = true, state } = {}) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(patch).forEach(([k, v]) => {
        if (v == null || v === '' || v === ALL || (k === 'status' && v === 'all') || (k === 'sort' && v === 'curated')) next.delete(k);
        else next.set(k, v);
      });
      return next;
    }, { replace, state, preventScrollReset: true });
  }, [setParams]);

  const shown = useMemo(() => filterArtworks(artworks, { category, status, sort }), [artworks, category, status, sort]);
  const featured = useMemo(() => featuredFrom(artworks), [artworks]);
  const stats = galleryStats(artworks);

  const navList = shown.some((a) => a.id === pieceId) ? shown : artworks;
  const index = navList.findIndex((a) => a.id === pieceId);
  const current = index >= 0 ? navList[index] : null;

  const step = (dir) => {
    if (!navList.length) return;
    const next = navList[(index + dir + navList.length) % navList.length];
    update({ piece: next.id }, { state: location.state });
  };

  const open = (id) => update({ piece: id }, { replace: false, state: { viewer: true } });

  const close = () => {
    if (location.state?.viewer) navigate(-1);
    else update({ piece: null });
  };

  const filtered = category !== ALL || status !== 'all';

  return (
    <div className={styles.page}>
      <Hero pieces={featured} onOpen={open} cta={t.heroCta} />
      <Marquee text={t.marquee} />

      <section className={styles.intro}>
        <h1 className={styles.heading}>{t.heading}</h1>
        <div className={styles.introSide}>
          <p className={styles.lede}>{t.intro}</p>
          {!loading && !failed && stats.total > 0 && <p className={styles.stats}>{fillTemplate(t.stats, stats)}</p>}
        </div>
      </section>

      <section id="collection" className={styles.collection} aria-labelledby="collection-title">
        <div className={styles.collectionHead}>
          <h2 id="collection-title" className={styles.collectionTitle}>{t.collectionHeading}</h2>
          <span className={styles.count}>{shown.length}</span>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.tabs} role="group" aria-label="Show by kind">
            {CATEGORY_FILTERS.map((c) => (
              <button
                key={c}
                type="button"
                className={`${styles.tab} ${category === c ? styles.tabOn : ''}`}
                aria-pressed={category === c}
                onClick={() => update({ category: c })}
              >
                {c === ALL ? 'All works' : c}
              </button>
            ))}
          </div>

          <div className={styles.controls}>
            <div className={styles.segment} role="group" aria-label="Show by availability">
              {STATUSES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  className={`${styles.segBtn} ${status === s.value ? styles.segOn : ''}`}
                  aria-pressed={status === s.value}
                  onClick={() => update({ status: s.value })}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <label className={styles.sort}>
              <span className="sr-only">Order the works</span>
              <select className="input" value={sort} onChange={(e) => update({ sort: e.target.value })}>
                {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </label>
          </div>
        </div>

        {failed && <p className={styles.notice}>{t.error}</p>}

        {!failed && !loading && shown.length === 0 && (
          <div className={styles.notice}>
            <p>{t.empty}</p>
            {filtered && (
              <button type="button" className="btn btn-quiet" onClick={() => update({ category: ALL, status: 'all' })}>
                Show all works
              </button>
            )}
          </div>
        )}

        <div className={styles.grid} aria-busy={loading}>
          {loading
            ? Array.from({ length: 6 }, (_, i) => <div key={i} className={styles.ghost} aria-hidden="true" />)
            : shown.map((a, i) => <ArtworkCard key={a.id} artwork={a} eager={i < 3} onOpen={open} />)}
        </div>
      </section>

      <CursorBubble />

      <Viewer
        artwork={current}
        position={index + 1}
        total={navList.length}
        onPrev={() => step(-1)}
        onNext={() => step(1)}
        onClose={close}
        copy={viewerCopy}
      />
    </div>
  );
};

export default Gallery;

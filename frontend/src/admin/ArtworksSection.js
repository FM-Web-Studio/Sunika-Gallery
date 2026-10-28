import { useEffect, useState } from 'react';
import { FiArrowUp, FiArrowDown, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';
import {
  subscribeArtworks, createArtwork, updateArtwork, deleteArtwork, setArtworkSold, reorderArtworks,
} from '../firebase/artworks';
import { artworkMeta, artworkSrc, formatPrice } from '../lib/gallery';
import { moveItem } from '../lib/ordering';
import { saveErrorMessage } from '../lib/uploads';
import ArtworkForm from './ArtworkForm';
import admin from './Admin.module.css';
import styles from './ArtworksSection.module.css';

const ArtworksSection = () => {
  const { notify } = useToast();
  const [artworks, setArtworks] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => subscribeArtworks(
    (list) => { setArtworks(list); setLoaded(true); },
    () => notify('error', 'Artworks could not load. Refresh the page to try again.'),
  ), [notify]);

  const closeForm = () => { if (!saving) setEditing(null); };

  const save = async (data, file) => {
    setSaving(true);
    try {
      if (editing === 'new') {
        const first = artworks.length ? Math.min(...artworks.map((a) => (typeof a.order === 'number' ? a.order : 0))) : 0;
        await createArtwork(data, file, first - 1);
        notify('success', `${data.title} is on the wall.`);
      } else {
        await updateArtwork(editing, data, file);
        notify('success', file ? 'Saved. The old image was deleted.' : 'Saved.');
      }
      setEditing(null);
    } catch (err) {
      console.error(err);
      notify('error', saveErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const move = async (index, dir) => {
    const next = moveItem(artworks, index, index + dir);
    if (next === artworks) return;
    setArtworks(next);
    try {
      await reorderArtworks(next.map((a) => a.id));
    } catch (err) {
      notify('error', saveErrorMessage(err));
    }
  };

  const toggleSold = async (a) => {
    setBusyId(a.id);
    try {
      await setArtworkSold(a.id, !a.sold);
    } catch (err) {
      notify('error', saveErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    const a = removing;
    setBusyId(a.id);
    try {
      await deleteArtwork(a);
      notify('success', `${a.title || 'The artwork'} was deleted, with its images, ratings and hearts.`);
      setRemoving(null);
    } catch (err) {
      notify('error', saveErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const sold = artworks.filter((a) => a.sold).length;

  return (
    <div className={admin.section}>
      <div className={admin.sectionHead}>
        <div>
          <h1>Artworks</h1>
          <p>{artworks.length} on the wall, {sold} sold. The order here is the order visitors see.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setEditing('new')}>
          <FiPlus aria-hidden="true" /> Add artwork
        </button>
      </div>

      {loaded && artworks.length === 0 && (
        <p className={admin.empty}>The wall is empty. Add your first artwork to start the gallery.</p>
      )}

      <ol className={styles.list}>
        {artworks.map((a, i) => (
          <li key={a.id} className={styles.row}>
            <div className={styles.thumb}>
              {artworkSrc(a) && <img src={artworkSrc(a)} alt="" loading="lazy" />}
            </div>
            <div className={styles.info}>
              <p className={`${styles.title} art-title`}>{a.title || 'Untitled'}</p>
              <p className={styles.meta}>{[artworkMeta(a), formatPrice(a.price)].filter(Boolean).join(', ')}</p>
            </div>
            <label className={styles.soldSwitch}>
              <input type="checkbox" checked={!!a.sold} onChange={() => toggleSold(a)} disabled={busyId === a.id} />
              <span>Sold</span>
            </label>
            <div className={styles.actions}>
              <button type="button" className="icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${a.title} up`}>
                <FiArrowUp aria-hidden="true" />
              </button>
              <button type="button" className="icon-btn" onClick={() => move(i, 1)} disabled={i === artworks.length - 1} aria-label={`Move ${a.title} down`}>
                <FiArrowDown aria-hidden="true" />
              </button>
              <button type="button" className="icon-btn" onClick={() => setEditing(a)} aria-label={`Edit ${a.title}`}>
                <FiEdit2 aria-hidden="true" />
              </button>
              <button type="button" className={`icon-btn ${styles.danger}`} onClick={() => setRemoving(a)} aria-label={`Delete ${a.title}`}>
                <FiTrash2 aria-hidden="true" />
              </button>
            </div>
          </li>
        ))}
      </ol>

      <Modal open={!!editing} onClose={closeForm} title={editing === 'new' ? 'Add artwork' : 'Edit artwork'} size="lg">
        {editing && (
          <ArtworkForm
            key={editing === 'new' ? 'new' : editing.id}
            initial={editing === 'new' ? null : editing}
            onSubmit={save}
            onCancel={closeForm}
            saving={saving}
          />
        )}
      </Modal>

      <Modal open={!!removing} onClose={() => busyId || setRemoving(null)} title="Delete this artwork?" size="sm">
        {removing && (
          <div className={styles.confirm}>
            <p>
              <span className="art-title">{removing.title || 'Untitled'}</span> will be removed from the gallery, along with
              its images, ratings and hearts. This cannot be undone.
            </p>
            <div className={styles.confirmActions}>
              <button type="button" className="btn btn-quiet" onClick={() => setRemoving(null)} disabled={!!busyId}>Keep it</button>
              <button type="button" className="btn btn-danger" onClick={confirmDelete} disabled={!!busyId}>
                {busyId ? 'Deleting' : 'Delete artwork'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ArtworksSection;

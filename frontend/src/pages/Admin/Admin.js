import React, { useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Modal, useToast } from '../../components';
import { useAuth } from '../../hooks';
import {
  signInWithGoogle, signOutUser,
  subscribeArtworks, createArtwork, updateArtwork, deleteArtwork, setArtworkSold,
  subscribeSiteSettings, updateSiteSettings, DEFAULT_SETTINGS,
  formatPrice,
} from '../../firebase';
import Loading from '../Loading';
import ArtworkForm from './ArtworkForm';
import SettingsForm from './SettingsForm';
import styles from './Admin.module.css';

const Admin = () => {
  const { user, loading, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [artworks, setArtworks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    if (!isAdmin) return undefined;
    return subscribeArtworks(setArtworks, () => showToast?.('error', 'Load failed', 'Could not load artworks.'));
  }, [isAdmin, showToast]);

  useEffect(() => {
    if (!isAdmin) return undefined;
    return subscribeSiteSettings(setSettings, () => {});
  }, [isAdmin]);

  if (loading) return <Loading message="Checking access" showVerse={false} />;

  // ── Not signed in ──────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className={styles.center}>
        <div className={styles.authCard}>
          <h1 className={styles.authTitle}>Admin</h1>
          <p className={styles.authText}>Sign in to manage the gallery.</p>
          <button className={styles.googleBtn} onClick={() => signInWithGoogle().catch(() => showToast?.('error', 'Sign-in failed', 'Please try again.'))}>
            <FcGoogle /> Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  // ── Signed in but not allowlisted ───────────────────────────────────────────
  if (!isAdmin) {
    return (
      <div className={styles.center}>
        <div className={styles.authCard}>
          <h1 className={styles.authTitle}>Not authorised</h1>
          <p className={styles.authText}>
            {user.email} is not an admin account.
          </p>
          <button className={styles.signOut} onClick={() => signOutUser()}>Sign out</button>
        </div>
      </div>
    );
  }

  // ── Admin actions ────────────────────────────────────────────────────────────
  const openAdd  = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (a) => { setEditing(a); setModalOpen(true); };
  const closeModal = () => { if (!saving) { setModalOpen(false); setEditing(null); } };

  const handleSubmit = async (data, file) => {
    setSaving(true);
    try {
      if (editing) {
        await updateArtwork(editing.id, data, file, editing.imagePath);
        showToast?.('success', 'Saved', 'Artwork updated.');
      } else {
        await createArtwork(data, file);
        showToast?.('success', 'Added', 'Artwork created.');
      }
      setModalOpen(false);
      setEditing(null);
    } catch (e) {
      showToast?.('error', 'Save failed', e.message || 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleSold = async (a) => {
    try { await setArtworkSold(a.id, !a.sold); }
    catch { showToast?.('error', 'Update failed', 'Could not change sold status.'); }
  };

  const handleDelete = async (a) => {
    if (!window.confirm(`Delete "${a.title || 'Untitled'}"? This cannot be undone.`)) return;
    try {
      await deleteArtwork(a.id, a.imagePath);
      showToast?.('success', 'Deleted', 'Artwork removed.');
    } catch {
      showToast?.('error', 'Delete failed', 'Please try again.');
    }
  };

  const handleSaveSettings = async (data) => {
    setSavingSettings(true);
    try {
      await updateSiteSettings(data);
      showToast?.('success', 'Saved', 'Contact details updated.');
      setSettingsOpen(false);
    } catch {
      showToast?.('error', 'Save failed', 'Could not update settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div>
          <h1 className={styles.heading}>Manage Gallery</h1>
          <p className={styles.who}>{user.email}</p>
        </div>
        <div className={styles.topActions}>
          <button className={styles.addBtn} onClick={openAdd}>+ Add artwork</button>
          <button className={styles.secondaryBtn} onClick={() => setSettingsOpen(true)}>Site settings</button>
          <button className={styles.signOut} onClick={() => signOutUser()}>Sign out</button>
        </div>
      </header>

      {artworks.length === 0 ? (
        <p className={styles.empty}>No artworks yet. Add your first piece.</p>
      ) : (
        <div className={styles.list}>
          {artworks.map((a) => (
            <div key={a.id} className={styles.row}>
              <div className={styles.thumb}>
                {a.imageUrl && <img src={a.imageUrl} alt={a.title} />}
              </div>
              <div className={styles.info}>
                <span className={styles.rowTitle}>{a.title || 'Untitled'}</span>
                <span className={styles.rowMeta}>{a.category} · {formatPrice(a.price)}</span>
              </div>
              <button
                className={`${styles.soldToggle} ${a.sold ? styles.soldOn : ''}`}
                onClick={() => handleToggleSold(a)}
              >
                {a.sold ? 'Sold' : 'Available'}
              </button>
              <div className={styles.rowActions}>
                <button className={styles.edit} onClick={() => openEdit(a)}>Edit</button>
                <button className={styles.delete} onClick={() => handleDelete(a)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={closeModal} title={editing ? 'Edit artwork' : 'Add artwork'}>
        <ArtworkForm
          initial={editing}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          submitting={saving}
        />
      </Modal>

      <Modal open={settingsOpen} onClose={() => !savingSettings && setSettingsOpen(false)} title="Site settings">
        <SettingsForm
          initial={settings}
          onSubmit={handleSaveSettings}
          onCancel={() => setSettingsOpen(false)}
          submitting={savingSettings}
        />
      </Modal>
    </div>
  );
};

export default Admin;

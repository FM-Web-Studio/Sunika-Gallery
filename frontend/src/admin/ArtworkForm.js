import { useEffect, useState } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import { CATEGORIES } from '../firebase/config';
import { artworkSrc } from '../lib/gallery';
import { tooLarge, tooLargeMessage } from '../lib/uploads';
import styles from './ArtworkForm.module.css';

const ArtworkForm = ({ initial, onSubmit, onCancel, saving }) => {
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    category: initial?.category ?? CATEGORIES[0],
    price: initial?.price ? String(initial.price) : '',
    dimensions: initial?.dimensions ?? '',
    description: initial?.description ?? '',
    sold: !!initial?.sold,
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(artworkSrc(initial));
  const [error, setError] = useState('');

  useEffect(() => () => { if (preview.startsWith('blob:')) URL.revokeObjectURL(preview); }, [preview]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const pick = (e) => {
    const chosen = e.target.files?.[0];
    e.target.value = '';
    if (!chosen) return;
    if (!chosen.type.startsWith('image/')) return setError('Choose an image file, like a JPG, PNG or WebP.');
    if (tooLarge(chosen)) return setError(tooLargeMessage(chosen));
    setError('');
    setFile(chosen);
    setPreview(URL.createObjectURL(chosen));
    return undefined;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError('Give the artwork a title.');
    if (!initial && !file) return setError('Choose an image of the artwork.');
    setError('');
    onSubmit(form, file);
    return undefined;
  };

  return (
    <form className={styles.form} onSubmit={submit}>
      <label className={styles.drop}>
        {preview
          ? <img src={preview} alt="" className={styles.preview} />
          : <span className={styles.placeholder}><FiUploadCloud aria-hidden="true" /> Choose an image</span>}
        <span className={styles.dropAction}>{preview ? (initial ? 'Replace image' : 'Choose a different image') : 'Browse'}</span>
        <input type="file" accept="image/*" onChange={pick} className="sr-only" />
      </label>
      {initial && file && <p className={styles.note}>The current image will be deleted from storage once this one is saved.</p>}

      <div className={styles.fields}>
        <label className="field">
          <span>Title</span>
          <input className="input" value={form.title} onChange={set('title')} maxLength={160} />
        </label>

        <fieldset className={styles.kinds}>
          <legend>Kind</legend>
          <div className={styles.pills}>
            {CATEGORIES.map((c) => (
              <label key={c} className={`${styles.pill} ${form.category === c ? styles.pillOn : ''}`}>
                <input type="radio" name="category" value={c} checked={form.category === c} onChange={set('category')} className="sr-only" />
                {c}
              </label>
            ))}
          </div>
        </fieldset>

        <div className={styles.pair}>
          <label className="field">
            <span>Price in rand, leave empty for price on request</span>
            <input className="input" type="number" min="0" step="1" inputMode="numeric" value={form.price} onChange={set('price')} />
          </label>
          <label className="field">
            <span>Size</span>
            <input className="input" placeholder="40 x 60 cm" value={form.dimensions} onChange={set('dimensions')} maxLength={80} />
          </label>
        </div>

        <label className="field">
          <span>Description</span>
          <textarea className="input" rows={4} value={form.description} onChange={set('description')} maxLength={2000} />
        </label>

        <label className={styles.check}>
          <input type="checkbox" checked={form.sold} onChange={set('sold')} />
          <span>This piece is sold</span>
        </label>
      </div>

      {error && <p className={styles.error} role="alert">{error}</p>}

      <div className={styles.actions}>
        <button type="button" className="btn btn-quiet" onClick={onCancel} disabled={saving}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving' : initial ? 'Save changes' : 'Add artwork'}
        </button>
      </div>
    </form>
  );
};

export default ArtworkForm;

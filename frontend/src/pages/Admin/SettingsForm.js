import React, { useState } from 'react';
import { SOCIAL_TYPES } from '../../firebase';
import styles from './SettingsForm.module.css';

const labelFor = (type) => type.charAt(0).toUpperCase() + type.slice(1);

const SettingsForm = ({ initial, onSubmit, onCancel, submitting }) => {
  const [form, setForm] = useState({
    email:    initial?.email    ?? '',
    phone:    initial?.phone    ?? '',
    location: initial?.location ?? '',
    socials:  initial?.socials?.length ? initial.socials : [],
  });

  const setField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const updateSocial = (i, key, value) =>
    setForm((f) => ({
      ...f,
      socials: f.socials.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)),
    }));

  const addSocial = () =>
    setForm((f) => ({ ...f, socials: [...f.socials, { type: 'instagram', label: 'Instagram', href: '' }] }));

  const removeSocial = (i) =>
    setForm((f) => ({ ...f, socials: f.socials.filter((_, idx) => idx !== i) }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.grid}>
        <label className={styles.field}>
          <span className={styles.label}>Email</span>
          <input type="email" className={styles.input} value={form.email} onChange={setField('email')} />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Phone</span>
          <input type="text" className={styles.input} value={form.phone} onChange={setField('phone')} />
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>Location</span>
        <input type="text" className={styles.input} value={form.location} onChange={setField('location')} />
      </label>

      <div className={styles.socialsHeader}>
        <span className={styles.label}>Social links</span>
        <button type="button" className={styles.addSocial} onClick={addSocial}>+ Add</button>
      </div>

      {form.socials.map((s, i) => (
        <div key={i} className={styles.socialCard}>
          <div className={styles.socialTypeRow}>
            {SOCIAL_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                className={`${styles.typePill} ${s.type === t ? styles.typePillActive : ''}`}
                onClick={() => updateSocial(i, 'type', t)}
              >
                {labelFor(t)}
              </button>
            ))}
            <button type="button" className={styles.removeSocial} onClick={() => removeSocial(i)} aria-label="Remove">×</button>
          </div>
          <div className={styles.socialInputs}>
            <input
              className={styles.input}
              placeholder="Label"
              value={s.label ?? ''}
              onChange={(e) => updateSocial(i, 'label', e.target.value)}
            />
            <input
              className={styles.input}
              placeholder="https://… or mailto:…"
              value={s.href ?? ''}
              onChange={(e) => updateSocial(i, 'href', e.target.value)}
            />
          </div>
        </div>
      ))}

      <div className={styles.actions}>
        <button type="button" className={styles.cancel} onClick={onCancel} disabled={submitting}>Cancel</button>
        <button type="submit" className={styles.submit} disabled={submitting}>
          {submitting ? 'Saving…' : 'Save settings'}
        </button>
      </div>
    </form>
  );
};

export default SettingsForm;

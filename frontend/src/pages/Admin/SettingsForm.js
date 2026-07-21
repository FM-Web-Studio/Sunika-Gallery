import React, { useState } from 'react';
import {
  FaInstagram, FaFacebookF, FaWhatsapp, FaTiktok, FaLinkedinIn, FaEnvelope, FaLink,
} from 'react-icons/fa';
import { FiPlus, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import { SOCIAL_TYPES } from '../../firebase';
import styles from './SettingsForm.module.css';

const labelFor = (type) => type.charAt(0).toUpperCase() + type.slice(1);

const SOCIAL_ICONS = {
  instagram: FaInstagram,
  facebook:  FaFacebookF,
  whatsapp:  FaWhatsapp,
  tiktok:    FaTiktok,
  linkedin:  FaLinkedinIn,
  email:     FaEnvelope,
};

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

  // Changing platform also updates the label — unless the user set a custom one.
  const updateSocialType = (i, newType) =>
    setForm((f) => ({
      ...f,
      socials: f.socials.map((s, idx) => {
        if (idx !== i) return s;
        const wasDefault = !s.label || s.label === labelFor(s.type);
        return { ...s, type: newType, label: wasDefault ? labelFor(newType) : s.label };
      }),
    }));

  const addSocial = () =>
    setForm((f) => ({
      ...f,
      socials: [...f.socials, { type: SOCIAL_TYPES[0], label: labelFor(SOCIAL_TYPES[0]), href: '' }],
    }));

  const removeSocial = (i) =>
    setForm((f) => ({ ...f, socials: f.socials.filter((_, idx) => idx !== i) }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* ── Contact details ─────────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h3 className={styles.sectionTitle}>Contact details</h3>
          <p className={styles.sectionHint}>Shown on the contact page and in the contact card.</p>
        </div>

        <div className={styles.grid}>
          <label className={styles.field}>
            <span className={styles.label}>Email</span>
            <input type="email" className={styles.input} value={form.email} onChange={setField('email')} placeholder="you@example.com" />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Phone</span>
            <input type="text" className={styles.input} value={form.phone} onChange={setField('phone')} placeholder="+27 …" />
          </label>
        </div>

        <label className={styles.field}>
          <span className={styles.label}>Location</span>
          <input type="text" className={styles.input} value={form.location} onChange={setField('location')} placeholder="City, Country" />
        </label>
      </section>

      <div className={styles.divider} aria-hidden="true" />

      {/* ── Social links ────────────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h3 className={styles.sectionTitle}>Social links</h3>
          <p className={styles.sectionHint}>Choose a platform, then paste its link.</p>
        </div>

        {form.socials.length === 0 && (
          <p className={styles.emptySocials}>No social links yet.</p>
        )}

        <div className={styles.socialList}>
          {form.socials.map((s, i) => {
            const Icon = SOCIAL_ICONS[s.type] || FaLink;
            return (
              <div key={i} className={styles.socialCard}>
                <div className={styles.cardHead}>
                  <span className={styles.socialIcon} aria-hidden="true"><Icon /></span>

                  <label className={styles.headField}>
                    <span className={styles.label}>Platform</span>
                    <select
                      className={styles.select}
                      value={s.type}
                      onChange={(e) => updateSocialType(i, e.target.value)}
                    >
                      {SOCIAL_TYPES.map((t) => (
                        <option key={t} value={t}>{labelFor(t)}</option>
                      ))}
                    </select>
                  </label>

                  <button
                    type="button"
                    className={styles.removeSocial}
                    onClick={() => removeSocial(i)}
                    aria-label={`Remove ${s.label || 'social link'}`}
                    title="Remove"
                  >
                    <FiTrash2 aria-hidden="true" />
                  </button>
                </div>

                <div className={styles.grid}>
                  <label className={styles.field}>
                    <span className={styles.label}>Label</span>
                    <input
                      className={styles.input}
                      placeholder="e.g. Instagram"
                      value={s.label ?? ''}
                      onChange={(e) => updateSocial(i, 'label', e.target.value)}
                    />
                  </label>
                  <label className={styles.field}>
                    <span className={styles.label}>Link</span>
                    <input
                      className={styles.input}
                      placeholder="https://…  or  mailto:…"
                      value={s.href ?? ''}
                      onChange={(e) => updateSocial(i, 'href', e.target.value)}
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        <button type="button" className={styles.addSocial} onClick={addSocial}>
          <FiPlus aria-hidden="true" /> Add social link
        </button>
      </section>

      <div className={styles.actions}>
        <button type="button" className={styles.cancel} onClick={onCancel} disabled={submitting}>
          <FiX aria-hidden="true" /> Cancel
        </button>
        <button type="submit" className={styles.submit} disabled={submitting}>
          <FiCheck aria-hidden="true" /> {submitting ? 'Saving…' : 'Save settings'}
        </button>
      </div>
    </form>
  );
};

export default SettingsForm;

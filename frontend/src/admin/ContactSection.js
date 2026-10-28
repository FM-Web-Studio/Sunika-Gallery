import { useEffect, useRef, useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { useToast } from '../components/Toast';
import { useSite } from '../context/SiteContext';
import { saveContact } from '../firebase/contact';
import { SOCIAL_KEYS } from '../firebase/config';
import { saveErrorMessage } from '../lib/uploads';
import admin from './Admin.module.css';
import styles from './ContactSection.module.css';

const titleCase = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const ContactSection = () => {
  const { notify } = useToast();
  const { contact } = useSite();
  const [draft, setDraft] = useState(contact);
  const [saving, setSaving] = useState(false);
  const dirty = useRef(false);

  useEffect(() => { if (!dirty.current) setDraft(contact); }, [contact]);

  const change = (fn) => { dirty.current = true; setDraft(fn); };
  const set = (key) => (e) => change((d) => ({ ...d, [key]: e.target.value }));
  const setSocial = (i, key, value) => change((d) => ({ ...d, socials: d.socials.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)) }));
  const addSocial = () => change((d) => ({ ...d, socials: [...d.socials, { key: 'instagram', label: '', url: '' }] }));
  const removeSocial = (i) => change((d) => ({ ...d, socials: d.socials.filter((_, idx) => idx !== i) }));

  const save = async () => {
    setSaving(true);
    try {
      const socials = draft.socials
        .map((s) => ({ key: (s.key || '').trim().toLowerCase(), label: (s.label || '').trim(), url: (s.url || '').trim() }))
        .filter((s) => s.url);
      await saveContact({ ...draft, socials });
      dirty.current = false;
      notify('success', 'Contact details saved on both sites.');
    } catch (err) {
      notify('error', saveErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={admin.section}>
      <div className={admin.sectionHead}>
        <div>
          <h1>Contact details</h1>
          <p>Shown on the contact page and in the footer. The portfolio site uses the same details.</p>
        </div>
      </div>

      <section className={admin.card}>
        <h2>How people reach you</h2>
        <div className={admin.grid2}>
          <label className="field">
            <span>Email</span>
            <input className="input" type="email" value={draft.email} onChange={set('email')} />
          </label>
          <label className="field">
            <span>Phone</span>
            <input className="input" type="tel" value={draft.phone} onChange={set('phone')} />
          </label>
        </div>
        <label className="field">
          <span>Location</span>
          <input className="input" value={draft.location} onChange={set('location')} />
        </label>
      </section>

      <section className={admin.card}>
        <div className={admin.sectionHead}>
          <h2>Social links</h2>
          <button type="button" className="btn btn-quiet" onClick={addSocial}><FiPlus aria-hidden="true" /> Add link</button>
        </div>
        {draft.socials.length === 0 && <p className={admin.hint}>No links yet.</p>}
        {draft.socials.map((s, i) => (
          <div key={i} className={styles.social}>
            <label className="field">
              <span>Platform</span>
              <select className="input" value={SOCIAL_KEYS.includes(s.key) ? s.key : 'website'} onChange={(e) => setSocial(i, 'key', e.target.value)}>
                {SOCIAL_KEYS.map((k) => <option key={k} value={k}>{titleCase(k)}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Name shown</span>
              <input className="input" placeholder={titleCase(s.key || 'Link')} value={s.label} onChange={(e) => setSocial(i, 'label', e.target.value)} />
            </label>
            <label className="field">
              <span>Address</span>
              <input className="input" placeholder="https://" value={s.url} onChange={(e) => setSocial(i, 'url', e.target.value)} />
            </label>
            <button type="button" className={`icon-btn ${styles.remove}`} onClick={() => removeSocial(i)} aria-label={`Remove ${s.label || s.key}`}>
              <FiTrash2 aria-hidden="true" />
            </button>
          </div>
        ))}
      </section>

      <div className={`${admin.saveBar} ${dirty.current ? admin.dirty : ''}`}>
        <p>{dirty.current ? 'You have unsaved changes.' : 'Everything is saved.'}</p>
        <button type="button" className="btn btn-primary" onClick={save} disabled={saving}>
          {saving ? 'Saving' : 'Save contact details'}
        </button>
      </div>
    </div>
  );
};

export default ContactSection;

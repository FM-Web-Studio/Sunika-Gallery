import { useEffect, useRef, useState } from 'react';
import { useToast } from '../components/Toast';
import { useSite } from '../context/SiteContext';
import { saveContent } from '../firebase/content';
import { COPY_SCHEMA, overridesFor } from '../content/siteCopy';
import { saveErrorMessage } from '../lib/uploads';
import admin from './Admin.module.css';
import styles from './CopySection.module.css';

const buildDraft = (saved = {}) => Object.fromEntries(COPY_SCHEMA.map((g) => [
  g.key,
  Object.fromEntries(g.fields.map((f) => {
    const ov = saved?.[g.key]?.[f.key];
    return [f.key, typeof ov === 'string' && ov.trim() ? ov : f.default];
  })),
]));

const CopySection = () => {
  const { notify } = useToast();
  const { content, reload } = useSite();
  const [group, setGroup] = useState(COPY_SCHEMA[0].key);
  const [draft, setDraft] = useState(() => buildDraft(content));
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const dirtyRef = useRef(false);

  useEffect(() => { if (!dirtyRef.current) setDraft(buildDraft(content)); }, [content]);

  const set = (g, key, value) => {
    dirtyRef.current = true;
    setDirty(true);
    setDraft((d) => ({ ...d, [g]: { ...d[g], [key]: value } }));
  };

  const save = async () => {
    setSaving(true);
    try {
      await saveContent(overridesFor(draft));
      dirtyRef.current = false;
      setDirty(false);
      await reload();
      notify('success', 'Wording saved.');
    } catch (err) {
      notify('error', saveErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const active = COPY_SCHEMA.find((g) => g.key === group) || COPY_SCHEMA[0];

  return (
    <div className={admin.section}>
      <div className={admin.sectionHead}>
        <div>
          <h1>Wording</h1>
          <p>Change any text visitors read. Reset a field to bring back the original.</p>
        </div>
      </div>

      <div className={styles.groups} role="tablist" aria-label="Page">
        {COPY_SCHEMA.map((g) => (
          <button
            key={g.key}
            type="button"
            role="tab"
            aria-selected={g.key === group}
            className={`${styles.group} ${g.key === group ? styles.groupOn : ''}`}
            onClick={() => setGroup(g.key)}
          >
            {g.label}
          </button>
        ))}
      </div>

      <section className={admin.card} role="tabpanel">
        {active.fields.map((f) => {
          const value = draft[active.key]?.[f.key] ?? '';
          const changed = value !== f.default;
          const id = `copy-${active.key}-${f.key}`;
          return (
            <div key={f.key} className="field">
              <div className={styles.labelRow}>
                <label htmlFor={id}>{f.label}</label>
                {changed && (
                  <button type="button" className={styles.reset} onClick={() => set(active.key, f.key, f.default)}>Reset</button>
                )}
              </div>
              {f.type === 'textarea'
                ? <textarea id={id} className="input" rows={3} value={value} onChange={(e) => set(active.key, f.key, e.target.value)} />
                : <input id={id} className="input" value={value} onChange={(e) => set(active.key, f.key, e.target.value)} />}
            </div>
          );
        })}
      </section>

      <div className={`${admin.saveBar} ${dirty ? admin.dirty : ''}`}>
        <p>{dirty ? 'You have unsaved changes. Saving covers every page, not only this one.' : 'Everything is saved.'}</p>
        <button type="button" className="btn btn-primary" onClick={save} disabled={saving || !dirty}>
          {saving ? 'Saving' : 'Save wording'}
        </button>
      </div>
    </div>
  );
};

export default CopySection;

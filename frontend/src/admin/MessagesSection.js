import { useState } from 'react';
import { FiTrash2, FiCornerUpLeft } from 'react-icons/fi';
import { useToast } from '../components/Toast';
import { deleteMessage, markMessageRead } from '../firebase/messages';
import { saveErrorMessage } from '../lib/uploads';
import admin from './Admin.module.css';
import styles from './MessagesSection.module.css';

const when = (ts) => {
  const d = ts?.toDate?.();
  if (!d) return 'Just now';
  return d.toLocaleString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const MessagesSection = ({ messages }) => {
  const { notify } = useToast();
  const [openId, setOpenId] = useState(null);

  const toggle = (m) => {
    setOpenId((id) => (id === m.id ? null : m.id));
    if (!m.read) markMessageRead(m.id).catch(() => {});
  };

  const remove = async (m) => {
    try {
      await deleteMessage(m.id);
      notify('success', `Message from ${m.name} deleted.`);
    } catch (err) {
      notify('error', saveErrorMessage(err));
    }
  };

  return (
    <div className={admin.section}>
      <div className={admin.sectionHead}>
        <div>
          <h1>Messages</h1>
          <p>Sent from the gallery contact form. Each one is also emailed to you.</p>
        </div>
      </div>

      {messages.length === 0 && (
        <p className={admin.empty}>No messages yet. When a visitor asks about a piece, it shows up here.</p>
      )}

      <ul className={styles.list}>
        {messages.map((m) => {
          const open = openId === m.id;
          return (
            <li key={m.id} className={`${styles.item} ${m.read ? '' : styles.unread}`}>
              <button type="button" className={styles.summary} onClick={() => toggle(m)} aria-expanded={open}>
                <span className={styles.dot} aria-label={m.read ? undefined : 'Unread'} />
                <span className={styles.from}>{m.name}</span>
                <span className={styles.preview}>{m.message}</span>
                <span className={styles.when}>{when(m.createdAt)}</span>
              </button>
              {open && (
                <div className={styles.body}>
                  <p className={styles.address}>{m.email}</p>
                  <p className={styles.text}>{m.message}</p>
                  <div className={styles.actions}>
                    <a className="btn btn-primary" href={`mailto:${m.email}?subject=${encodeURIComponent('Re: your message to Sunika Gallery')}`}>
                      <FiCornerUpLeft aria-hidden="true" /> Reply by email
                    </a>
                    <button type="button" className="btn btn-quiet" onClick={() => remove(m)}>
                      <FiTrash2 aria-hidden="true" /> Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MessagesSection;

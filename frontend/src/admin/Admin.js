import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FiImage, FiInbox, FiMail, FiType, FiMoon, FiSun } from 'react-icons/fi';
import Loading from '../components/Loading';
import { useToast } from '../components/Toast';
import { useAuth } from '../hooks/useAuth';
import { usePrefs } from '../hooks/usePrefs';
import { signInWithGoogle, signOutUser } from '../firebase/auth';
import { subscribeMessages } from '../firebase/messages';
import ArtworksSection from './ArtworksSection';
import MessagesSection from './MessagesSection';
import ContactSection from './ContactSection';
import CopySection from './CopySection';
import { LOGOS } from '../lib/logos';
import styles from './Admin.module.css';

const SECTIONS = [
  { id: 'artworks', label: 'Artworks', icon: FiImage, render: () => <ArtworksSection /> },
  { id: 'messages', label: 'Messages', icon: FiInbox, render: (p) => <MessagesSection messages={p.messages} /> },
  { id: 'contact', label: 'Contact details', icon: FiMail, render: () => <ContactSection /> },
  { id: 'copy', label: 'Wording', icon: FiType, render: () => <CopySection /> },
];

const Gate = ({ title, text, children }) => (
  <div className={styles.gate}>
    <div className={styles.gateCard}>
      <img src={LOGOS.mark} alt="" width="80" height="75" />
      <h1>{title}</h1>
      <p>{text}</p>
      {children}
    </div>
  </div>
);

const Workspace = ({ user }) => {
  const { notify } = useToast();
  const { theme, toggleTheme } = usePrefs();
  const [view, setView] = useState('artworks');
  const [messages, setMessages] = useState([]);

  useEffect(() => subscribeMessages(setMessages, (err) => {
    console.error('Messages could not load.', err);
    notify('error', 'Messages could not load. Refresh the page to try again.');
  }), [notify]);

  const unread = messages.filter((m) => !m.read).length;
  const active = SECTIONS.find((s) => s.id === view) || SECTIONS[0];

  return (
    <div className={styles.shell}>
      <header className={styles.top}>
        <Link to="/" className={styles.brand}>
          <img src={LOGOS.mark} alt="" width="40" height="38" />
          <span>Gallery admin</span>
        </Link>
        <div className={styles.account}>
          <span className={styles.email}>{user.email}</span>
          <button type="button" className="icon-btn" onClick={toggleTheme} aria-label="Switch theme">
            {theme === 'dark' ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
          </button>
          <Link to="/" className="btn btn-quiet">View site</Link>
          <button type="button" className="btn btn-quiet" onClick={() => signOutUser()}>Sign out</button>
        </div>
      </header>

      <nav className={styles.tabs} aria-label="Admin sections">
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`${styles.tab} ${view === id ? styles.tabOn : ''}`}
            aria-current={view === id ? 'page' : undefined}
            onClick={() => setView(id)}
          >
            <Icon aria-hidden="true" />
            {label}
            {id === 'messages' && unread > 0 && <span className={styles.badge}>{unread}</span>}
          </button>
        ))}
      </nav>

      <main key={view} className={styles.content}>
        {active.render({ messages })}
      </main>
    </div>
  );
};

const Admin = () => {
  const { user, loading, isAdmin } = useAuth();
  const { notify } = useToast();

  useEffect(() => {
    document.title = 'Gallery admin';
    return () => { document.title = 'Sunika Gallery'; };
  }, []);

  if (loading) return <Loading message="Checking who you are" showVerse={false} />;

  if (!user) {
    return (
      <Gate title="Gallery admin" text="Sign in with the Google account that manages the gallery.">
        <button
          type="button"
          className={`btn btn-quiet ${styles.google}`}
          onClick={() => signInWithGoogle().catch(() => notify('error', 'Sign in did not finish. Try again.'))}
        >
          <FcGoogle aria-hidden="true" /> Sign in with Google
        </button>
      </Gate>
    );
  }

  if (!isAdmin) {
    return (
      <Gate title="No access" text={`${user.email} is not on the admin list. Sign out and use the gallery's Google account.`}>
        <button type="button" className="btn btn-quiet" onClick={() => signOutUser()}>Sign out</button>
      </Gate>
    );
  }

  return <Workspace user={user} />;
};

export default Admin;

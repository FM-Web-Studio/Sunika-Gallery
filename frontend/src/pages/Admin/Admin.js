import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FiImage, FiLink, FiMail, FiEdit3, FiMenu } from 'react-icons/fi';
import { useToast } from '../../components';
import { useAuth } from '../../hooks';
import { signInWithGoogle, signOutUser } from '../../firebase';
import Loading from '../Loading';
import ArtworksSection from './ArtworksSection';
import SocialsSection from './SocialsSection';
import ContactSection from './ContactSection';
import SiteCopySection from './sections/SiteCopySection';
import styles from './Admin.module.css';
import '../../styles/admin.css';

const GROUPS = ['Gallery', 'Contact', 'Site'];

// `icon` is a react-icons component, not an emoji. The sidebar icons do real work
// helping someone find a section at a glance, so they are drawn as SVG rather than
// simply dropped. Emoji also render differently on every OS and cannot be coloured
// to match the theme.
const SECTIONS = [
  { id: 'artworks', group: 'Gallery', title: 'Artworks',        icon: FiImage, description: 'Original pieces in the gallery grid, with price and sold status.' },
  { id: 'socials',  group: 'Contact', title: 'Social Links',    icon: FiLink,  description: 'Profile links shown in the footer and on the Contact page.' },
  { id: 'contact',  group: 'Contact', title: 'Contact Details', icon: FiMail,  description: 'Email, phone and location shown in the footer and on the Contact page.' },
  { id: 'copy',     group: 'Site',    title: 'Site Copy',       icon: FiEdit3, description: 'Headings and wording used across the gallery pages.' },
];

const Admin = () => {
  const { user, loading, isAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [view, setView] = useState('artworks');
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (!navOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setNavOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navOpen]);

  const openSection = (id) => { setView(id); setNavOpen(false); };

  if (loading) return <Loading message="Checking access" showVerse={false} />;

  if (!user) {
    return (
      <div className={`admin-scope ${styles.center}`}>
        <div className={styles.authCard}>
          <h1 className={styles.authTitle}>Admin</h1>
          <p className={styles.authText}>Sign in to manage the gallery.</p>
          <button
            className={styles.googleBtn}
            onClick={() => signInWithGoogle().catch(() => showToast?.('error', 'Sign-in failed', 'Please try again.'))}
          >
            <FcGoogle /> Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className={`admin-scope ${styles.center}`}>
        <div className={styles.authCard}>
          <h1 className={styles.authTitle}>Not authorised</h1>
          <p className={styles.authText}>{user.email} is not an admin account.</p>
          <button className={styles.signOut} onClick={() => signOutUser()}>Sign out</button>
        </div>
      </div>
    );
  }

  const activeSection = SECTIONS.find((s) => s.id === view) ?? SECTIONS[0];
  const ActiveIcon = activeSection.icon;

  const renderSection = () => {
    switch (view) {
      case 'artworks': return <ArtworksSection />;
      case 'socials':  return <SocialsSection />;
      case 'contact':  return <ContactSection />;
      case 'copy':     return <SiteCopySection />;
      default: return null;
    }
  };

  return (
    <div className={`admin-scope ${styles.shellPage}`}>
      <div className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <button type="button" className={styles.menuBtn} onClick={() => setNavOpen(true)} aria-label="Open sections menu">
            <FiMenu aria-hidden="true" />
          </button>
          <span className={styles.topbarTitle}>Gallery Admin</span>
        </div>
        <div className={styles.topbarRight}>
          <span className={styles.userEmail}>{user.email}</span>
          <button type="button" className={styles.viewSiteBtn} onClick={() => navigate('/')}>View site</button>
          <button type="button" className={styles.signOut} onClick={() => signOutUser()}>Sign Out</button>
        </div>
      </div>

      <div className={styles.shell}>
        {navOpen && <div className={styles.navBackdrop} onClick={() => setNavOpen(false)} aria-hidden="true" />}
        <aside className={[styles.nav, navOpen ? styles.navOpen : ''].join(' ')} aria-label="Sections">
          {GROUPS.map((group) => (
            <div key={group} className={styles.navGroup}>
              <p className={styles.navGroupLabel}>{group}</p>
              {SECTIONS.filter((s) => s.group === group).map((s) => {
                const active = s.id === view;
                const Icon = s.icon;
                return (
                  <div key={s.id} className={[styles.navItem, active ? styles.navItemActive : ''].join(' ')}>
                    <button
                      type="button"
                      className={styles.navItemBtn}
                      onClick={() => openSection(s.id)}
                      aria-current={active ? 'page' : undefined}
                    >
                      <span className={styles.navIcon} aria-hidden="true"><Icon /></span>
                      <span className={styles.navLabel}>{s.title}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </aside>

        <main className={styles.content}>
          {/* Single source of the page heading, sections never repeat it. */}
          <header className={styles.pageHeader}>
            <span className={styles.pageIcon} aria-hidden="true"><ActiveIcon /></span>
            <div className={styles.pageHeadText}>
              <p className={styles.pageEyebrow}>{activeSection.group}</p>
              <h1 className={styles.contentTitle}>{activeSection.title}</h1>
              {activeSection.description && (
                <p className={styles.pageDesc}>{activeSection.description}</p>
              )}
            </div>
          </header>
          <div key={view} className={styles.sectionBody}>
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;

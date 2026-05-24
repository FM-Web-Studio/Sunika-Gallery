import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from './app';
import { COLLECTIONS, SETTINGS_DOC, DEFAULT_SETTINGS } from './config';

const settingsRef = () => doc(db, COLLECTIONS.settings, SETTINGS_DOC);

const withDefaults = (data) => ({
  email:    data?.email    ?? DEFAULT_SETTINGS.email,
  phone:    data?.phone    ?? DEFAULT_SETTINGS.phone,
  location: data?.location ?? DEFAULT_SETTINGS.location,
  socials:  Array.isArray(data?.socials) ? data.socials : DEFAULT_SETTINGS.socials,
});

export const getSiteSettings = async () => {
  const snap = await getDoc(settingsRef());
  return withDefaults(snap.exists() ? snap.data() : null);
};

export const subscribeSiteSettings = (cb, onError) =>
  onSnapshot(settingsRef(), (snap) => cb(withDefaults(snap.exists() ? snap.data() : null)), onError);

export const updateSiteSettings = (settings) =>
  setDoc(settingsRef(), {
    email:    settings.email    ?? '',
    phone:    settings.phone    ?? '',
    location: settings.location ?? '',
    socials:  (settings.socials ?? []).filter((s) => s.href?.trim()),
    updatedAt: serverTimestamp(),
  }, { merge: true });

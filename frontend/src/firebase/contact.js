import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from './app';
import { COLLECTIONS, SETTINGS_DOCS } from './config';

const contactRef = () => doc(db, COLLECTIONS.settings, SETTINGS_DOCS.contact);

export const EMPTY_CONTACT = { email: '', phone: '', location: '', socials: [] };

const asContact = (d) => ({
  email: d?.contact?.email ?? '',
  phone: d?.contact?.phone ?? '',
  location: d?.contact?.location ?? '',
  socials: Array.isArray(d?.socials) ? d.socials : [],
});

export const subscribeContact = (cb, onError) =>
  onSnapshot(contactRef(), (snap) => cb(asContact(snap.exists() ? snap.data() : null)), onError);

export const saveContact = ({ email, phone, location, socials }) =>
  setDoc(contactRef(), {
    contact: { email: email.trim(), phone: phone.trim(), location: location.trim() },
    socials,
    updatedAt: serverTimestamp(),
  }, { merge: true });

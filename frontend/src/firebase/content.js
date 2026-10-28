import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './app';
import { COLLECTIONS, SETTINGS_DOCS } from './config';

const contentRef = () => doc(db, COLLECTIONS.settings, SETTINGS_DOCS.content);

export const getContent = async () => {
  try {
    const snap = await getDoc(contentRef());
    return snap.exists() ? snap.data() : {};
  } catch (err) {
    console.error('Site wording could not load, showing the defaults.', err);
    return {};
  }
};

export const saveContent = (overrides) => setDoc(contentRef(), overrides);

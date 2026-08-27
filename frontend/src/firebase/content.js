import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './app';
import { SETTINGS_DOCS } from './config';

/*
 * Editable site copy, one document:
 *
 *   settings/galleryContent -> { brand:{...}, gallery:{...}, contactPage:{...} }
 *
 * The portfolio has its own settings/portfolioContent. Same shape, different groups.
 */
const contentRef = () => doc(db, 'settings', SETTINGS_DOCS.content);

/** The saved overrides object (only values that differ from code defaults). */
export async function getContent() {
  try {
    const snap = await getDoc(contentRef());
    return snap.exists() ? snap.data() : {};
  } catch (err) {
    console.error('Failed to load site content, using defaults:', err);
    return {};
  }
}

/**
 * Replace the overrides for a single group, e.g. saveContentGroup('gallery', {...}).
 * updateDoc sets the whole `group` field to the given object (replacing it), so a
 * cleared field is actually removed and falls back to its code default, while
 * sibling groups in the document are left untouched. Falls back to creating the
 * document if it does not exist yet.
 */
export async function saveContentGroup(group, overrides) {
  const ref = contentRef();
  try {
    await updateDoc(ref, { [group]: overrides });
  } catch {
    await setDoc(ref, { [group]: overrides }, { merge: true });
  }
}

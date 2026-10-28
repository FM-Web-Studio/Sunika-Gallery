import {
  collection, doc, setDoc, updateDoc, deleteDoc, getDocs,
  onSnapshot, serverTimestamp, writeBatch,
} from 'firebase/firestore';
import { db } from './app';
import { ARTWORK_VOTES, CATEGORIES, COLLECTIONS, STORAGE_FOLDERS } from './config';
import { uploadWithWebCopy, removeImages, pathFromUrl } from './files';
import { sortByOrder } from '../lib/ordering';

const COL = COLLECTIONS.artworks;
const artworkRef = (id) => doc(db, COL, id);
const folderFor = (id) => `${STORAGE_FOLDERS.artworks}/${id}`;

const imagePathsOf = (artwork = {}) => [
  artwork.imagePath || pathFromUrl(artwork.imageUrl),
  artwork.webPath || pathFromUrl(artwork.webUrl),
].filter(Boolean);

const imageFields = (upload) => ({
  imageUrl: upload.url,
  imagePath: upload.path,
  webUrl: upload.webUrl,
  webPath: upload.webPath,
  ...(upload.accent ? { accent: upload.accent } : {}),
  ...(upload.width ? { width: upload.width, height: upload.height } : {}),
});

const editableFields = (data) => ({
  title: (data.title ?? '').trim(),
  category: CATEGORIES.includes(data.category) ? data.category : CATEGORIES[0],
  description: (data.description ?? '').trim(),
  price: Math.max(0, Math.round(Number(data.price) || 0)),
  dimensions: (data.dimensions ?? '').trim(),
  sold: !!data.sold,
});

export const subscribeArtworks = (cb, onError) =>
  onSnapshot(
    collection(db, COL),
    (snap) => cb(sortByOrder(snap.docs.map((d) => ({ id: d.id, ...d.data() })))),
    onError,
  );

export const createArtwork = async (data, file, order) => {
  const ref = doc(collection(db, COL));
  const upload = await uploadWithWebCopy(folderFor(ref.id), file);
  try {
    await setDoc(ref, {
      ...editableFields(data),
      ...imageFields(upload),
      order: typeof order === 'number' ? order : Date.now(),
      ratingSum: 0,
      ratingCount: 0,
      likeCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    await removeImages([upload.path, upload.webPath]);
    throw err;
  }
  return ref.id;
};

export const updateArtwork = async (artwork, data, file) => {
  const patch = { ...editableFields(data), updatedAt: serverTimestamp() };
  if (!file) {
    await updateDoc(artworkRef(artwork.id), patch);
    return;
  }

  const oldPaths = imagePathsOf(artwork);
  const upload = await uploadWithWebCopy(folderFor(artwork.id), file);
  try {
    await updateDoc(artworkRef(artwork.id), { ...patch, ...imageFields(upload) });
  } catch (err) {
    await removeImages([upload.path, upload.webPath]);
    throw err;
  }
  await removeImages(oldPaths.filter((p) => p !== upload.path && p !== upload.webPath));
};

export const setArtworkSold = (id, sold) =>
  updateDoc(artworkRef(id), { sold: !!sold, updatedAt: serverTimestamp() });

export const reorderArtworks = async (ids) => {
  const batch = writeBatch(db);
  ids.forEach((id, i) => batch.update(artworkRef(id), { order: i }));
  await batch.commit();
};

const deleteVotes = async (id) => {
  const snaps = await Promise.all(
    Object.values(ARTWORK_VOTES).map((sub) => getDocs(collection(db, COL, id, sub))),
  );
  const refs = snaps.flatMap((s) => s.docs.map((d) => d.ref));
  for (let i = 0; i < refs.length; i += 400) {
    const batch = writeBatch(db);
    refs.slice(i, i + 400).forEach((r) => batch.delete(r));
    await batch.commit();
  }
};

export const deleteArtwork = async (artwork) => {
  await deleteVotes(artwork.id);
  await deleteDoc(artworkRef(artwork.id));
  await removeImages(imagePathsOf(artwork));
};

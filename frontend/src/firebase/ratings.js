import { doc, getDoc, increment, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from './app';
import { ARTWORK_VOTES, COLLECTIONS } from './config';
import { ensureVisitor } from './auth';
import { cachedRating, cacheRating } from '../lib/voteCache';

const artworkRef = (id) => doc(db, COLLECTIONS.artworks, id);
const raterRef = (artworkId, uid) => doc(db, COLLECTIONS.artworks, artworkId, ARTWORK_VOTES.raters, uid);

export const averageRating = ({ ratingSum = 0, ratingCount = 0 } = {}) =>
  ratingCount > 0 ? ratingSum / ratingCount : 0;

export const getMyRating = (artworkId) => cachedRating(artworkId);

export const rateArtwork = async (artworkId, value) => {
  const v = Math.round(Number(value));
  if (!(v >= 1 && v <= 5)) throw new Error('Pick between one and five stars.');

  const uid = await ensureVisitor();
  const ref = raterRef(artworkId, uid);

  const existing = await getDoc(ref);
  if (existing.exists()) {
    cacheRating(artworkId, Number(existing.data().value) || v);
    const err = new Error('You have already rated this piece.');
    err.code = 'already-rated';
    throw err;
  }

  const batch = writeBatch(db);
  batch.set(ref, { value: v, createdAt: serverTimestamp() });
  batch.update(artworkRef(artworkId), { ratingSum: increment(v), ratingCount: increment(1) });
  await batch.commit();

  cacheRating(artworkId, v);
  return v;
};

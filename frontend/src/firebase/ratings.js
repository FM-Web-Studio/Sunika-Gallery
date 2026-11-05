import { doc, getDoc } from 'firebase/firestore';
import { db } from './app';
import vote, { voteError } from './vote';
import { ARTWORK_VOTES, COLLECTIONS } from './config';
import { ensureVisitor } from './auth';
import { cachedRating, cacheRating } from '../lib/voteCache';

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

  let result;
  try {
    ({ data: result } = await vote({ artworkId, kind: 'rate', value: v }));
  } catch (err) {
    throw voteError(err);
  }
  if (result.alreadyRated) {
    cacheRating(artworkId, result.value);
    const err = new Error('You have already rated this piece.');
    err.code = 'already-rated';
    throw err;
  }

  cacheRating(artworkId, result.value);
  return result.value;
};

import { doc, getDoc } from 'firebase/firestore';
import { db } from './app';
import vote, { voteError } from './vote';
import { ARTWORK_VOTES, COLLECTIONS } from './config';
import { ensureVisitor } from './auth';
import { cachedLike, cacheLike } from '../lib/voteCache';

const likerRef = (artworkId, uid) => doc(db, COLLECTIONS.artworks, artworkId, ARTWORK_VOTES.likers, uid);

export const hasLiked = (artworkId) => cachedLike(artworkId);

export const toggleLike = async (artworkId) => {
  const uid = await ensureVisitor();
  const ref = likerRef(artworkId, uid);
  const wasLiked = (await getDoc(ref)).exists();

  let liked;
  try {
    ({ data: { liked } } = await vote({ artworkId, kind: 'like', like: !wasLiked }));
  } catch (err) {
    throw voteError(err);
  }

  cacheLike(artworkId, liked);
  return liked;
};

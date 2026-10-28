import { doc, getDoc, increment, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from './app';
import { ARTWORK_VOTES, COLLECTIONS } from './config';
import { ensureVisitor } from './auth';
import { cachedLike, cacheLike } from '../lib/voteCache';

const artworkRef = (id) => doc(db, COLLECTIONS.artworks, id);
const likerRef = (artworkId, uid) => doc(db, COLLECTIONS.artworks, artworkId, ARTWORK_VOTES.likers, uid);

export const hasLiked = (artworkId) => cachedLike(artworkId);

export const toggleLike = async (artworkId) => {
  const uid = await ensureVisitor();
  const ref = likerRef(artworkId, uid);
  const wasLiked = (await getDoc(ref)).exists();

  const batch = writeBatch(db);
  if (wasLiked) batch.delete(ref);
  else batch.set(ref, { createdAt: serverTimestamp() });
  batch.update(artworkRef(artworkId), { likeCount: increment(wasLiked ? -1 : 1) });
  await batch.commit();

  cacheLike(artworkId, !wasLiked);
  return !wasLiked;
};

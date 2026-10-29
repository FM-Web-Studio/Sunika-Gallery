import {
  collection, addDoc, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, Timestamp,
} from 'firebase/firestore';
import { db } from './app';
import { COLLECTIONS } from './config';
import { messageFields } from '../lib/message';

const inbox = () => collection(db, COLLECTIONS.messages);

export const submitMessage = (form) => {
  const { expireAt, ...fields } = messageFields(form);
  return addDoc(inbox(), { ...fields, createdAt: serverTimestamp(), expireAt: Timestamp.fromDate(expireAt) });
};

export const subscribeMessages = (cb, onError) =>
  onSnapshot(
    query(inbox(), orderBy('createdAt', 'desc')),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError,
  );

export const markMessageRead = (id) => updateDoc(doc(inbox(), id), { read: true });

export const deleteMessage = (id) => deleteDoc(doc(inbox(), id));

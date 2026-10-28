import {
  collection, addDoc, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc,
} from 'firebase/firestore';
import { db } from './app';
import { COLLECTIONS } from './config';

const inbox = () => collection(db, COLLECTIONS.messages);

export const submitMessage = ({ name, email, message }) =>
  addDoc(inbox(), {
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    createdAt: serverTimestamp(),
  });

export const subscribeMessages = (cb, onError) =>
  onSnapshot(
    query(inbox(), orderBy('createdAt', 'desc')),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError,
  );

export const markMessageRead = (id) => updateDoc(doc(inbox(), id), { read: true });

export const deleteMessage = (id) => deleteDoc(doc(inbox(), id));

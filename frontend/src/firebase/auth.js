import { signInWithPopup, signInAnonymously, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from './app';
import { ADMIN_EMAILS } from './config';

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

export const signOutUser = () => signOut(auth);

export const onAuthChange = (cb) => onAuthStateChanged(auth, cb);

export const isAdminEmail = (email) => !!email && ADMIN_EMAILS.includes(email.toLowerCase());

const DISABLED = ['auth/admin-restricted-operation', 'auth/operation-not-allowed'];

export const ensureVisitor = async () => {
  if (auth.currentUser) return auth.currentUser.uid;
  try {
    const { user } = await signInAnonymously(auth);
    return user.uid;
  } catch (err) {
    if (DISABLED.includes(err?.code)) {
      console.error('Anonymous sign-in is off for this Firebase project, so ratings and likes cannot be saved. Turn it on under Authentication, Sign-in method, Anonymous.');
      const friendly = new Error('Ratings and likes are switched off on this site for now.');
      friendly.code = 'visitor-auth-disabled';
      throw friendly;
    }
    throw err;
  }
};

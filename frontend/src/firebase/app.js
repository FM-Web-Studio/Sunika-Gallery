import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const app = initializeApp({
  apiKey: import.meta.env.FIREBASE_API_KEY,
  authDomain: import.meta.env.FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.FIREBASE_APP_ID,
  measurementId: import.meta.env.FIREBASE_MEASUREMENT_ID,
});

// App Check stays off until a reCAPTCHA v3 site key is set, and must start before Firestore, Storage or Auth.
export const appCheckOn = !!import.meta.env.FIREBASE_APPCHECK_SITE_KEY;

if (appCheckOn) {
  const debugToken = import.meta.env.DEV && import.meta.env.FIREBASE_APPCHECK_DEBUG_TOKEN;
  if (debugToken) self.FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken;
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(import.meta.env.FIREBASE_APPCHECK_SITE_KEY),
    isTokenAutoRefreshEnabled: true,
  });
}

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

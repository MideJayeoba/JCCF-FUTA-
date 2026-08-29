import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;

export const isFirebaseConfigured: boolean = Boolean(
  metaEnv?.VITE_FIREBASE_API_KEY && 
  metaEnv.VITE_FIREBASE_API_KEY !== 'AIzaSyDummyKeyForStandaloneMode' &&
  !metaEnv.VITE_FIREBASE_API_KEY.includes('Dummy')
);

const firebaseConfig = {
  apiKey: metaEnv?.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForStandaloneMode",
  authDomain: metaEnv?.VITE_FIREBASE_AUTH_DOMAIN || "jccf-futa.firebaseapp.com",
  projectId: metaEnv?.VITE_FIREBASE_PROJECT_ID || "jccf-futa",
  storageBucket: metaEnv?.VITE_FIREBASE_STORAGE_BUCKET || "jccf-futa.appspot.com",
  messagingSenderId: metaEnv?.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: metaEnv?.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({
  prompt: 'select_account'
});


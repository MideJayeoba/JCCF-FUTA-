import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const defaultFirebaseConfig = {
  apiKey: "AIzaSyDummyKeyForStandaloneMode",
  authDomain: "jccf-futa.firebaseapp.com",
  projectId: "jccf-futa",
  storageBucket: "jccf-futa.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef"
};

let config = defaultFirebaseConfig;

const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;
if (metaEnv && metaEnv.VITE_FIREBASE_API_KEY) {
  config = {
    apiKey: metaEnv.VITE_FIREBASE_API_KEY,
    authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || 'jccf-futa.firebaseapp.com',
    projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || 'jccf-futa',
    storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || 'jccf-futa.appspot.com',
    messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
    appId: metaEnv.VITE_FIREBASE_APP_ID || '1:1234567890:web:abcdef'
  };
}

const app = getApps().length === 0 ? initializeApp(config) : getApp();
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({
  prompt: 'select_account'
});


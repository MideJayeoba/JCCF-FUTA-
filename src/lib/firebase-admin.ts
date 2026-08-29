import { initializeApp, getApps, getApp, App, cert } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';

let adminApp: App | undefined;
let adminAuthInstance: Auth | undefined;

try {
  if (!getApps().length) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        adminApp = initializeApp({
          credential: cert(serviceAccount),
          projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id || 'jccf-futa',
        });
      } catch (parseErr) {
        console.warn('Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:', parseErr);
        adminApp = initializeApp({
          projectId: process.env.FIREBASE_PROJECT_ID || 'jccf-futa',
        });
      }
    } else {
      adminApp = initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'jccf-futa',
      });
    }
  } else {
    adminApp = getApp();
  }

  if (adminApp) {
    adminAuthInstance = getAuth(adminApp);
  }
} catch (e) {
  console.warn('Firebase Admin initialization notice (safe fallback enabled):', e);
}

export const adminAuth = {
  verifyIdToken: async (token: string) => {
    if (!adminAuthInstance) {
      throw new Error('Firebase Admin Auth not initialized with live credentials');
    }
    return adminAuthInstance.verifyIdToken(token);
  },
  getApp: () => adminApp,
};

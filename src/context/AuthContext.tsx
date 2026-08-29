import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleAuthProvider, isFirebaseConfigured } from '../lib/firebase';

export interface UserProfile {
  id?: number;
  uid: string;
  email: string;
  displayName?: string;
  photoUrl?: string;
  role: 'superadmin' | 'admin' | 'executive' | 'member';
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  idToken: string | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isLoading: boolean;
  isFirebaseConfigured: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = async (user: User, token: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUserProfile(data.user);
      } else {
        // Fallback default
        const isMaster = user.email?.toLowerCase() === 'jayeobapeace19459@gmail.com';
        setUserProfile({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoUrl: user.photoURL || '',
          role: isMaster ? 'superadmin' : 'member'
        });
      }
    } catch (err) {
      console.warn('Could not fetch user profile from server:', err);
    }
  };

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setIsLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        async (user) => {
          setIsLoading(true);
          if (user) {
            setCurrentUser(user);
            try {
              const token = await user.getIdToken();
              setIdToken(token);
              await fetchProfile(user, token);
            } catch (err) {
              console.warn('Could not obtain user ID token:', err);
            }
          } else {
            setCurrentUser(null);
            setUserProfile(null);
            setIdToken(null);
          }
          setIsLoading(false);
        },
        (error) => {
          console.warn('Firebase Auth notice:', error?.message);
          setIsLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn('Firebase auth listener skipped:', err);
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured) {
      throw new Error('Google Sign-in is not configured with a valid Firebase API Key in this environment. Please use the Administrator Email & PIN / Passkey login below.');
    }

    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const token = await result.user.getIdToken();
      setIdToken(token);
      await fetchProfile(result.user, token);
    } catch (err: any) {
      if (err?.code === 'auth/api-key-not-valid' || err?.message?.includes('api-key-not-valid')) {
        throw new Error('Google Sign-in is not configured with a valid Firebase API Key. Please use the Administrator Email & PIN / Passkey login below.');
      }
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        throw new Error('Sign-in popup was closed. Please try again.');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (isFirebaseConfigured) {
        await signOut(auth);
      }
      setCurrentUser(null);
      setUserProfile(null);
      setIdToken(null);
    } catch (err) {
      console.warn('Sign-out completed with notice:', err);
      setCurrentUser(null);
      setUserProfile(null);
      setIdToken(null);
    }
  };

  const getIdToken = async (): Promise<string | null> => {
    if (!currentUser || !isFirebaseConfigured) return null;
    try {
      const token = await currentUser.getIdToken(true);
      setIdToken(token);
      return token;
    } catch (err) {
      console.warn('Token refresh notice:', err);
      return idToken;
    }
  };

  const refreshProfile = async () => {
    if (currentUser && idToken) {
      await fetchProfile(currentUser, idToken);
    }
  };

  const isSuperAdmin = userProfile?.role === 'superadmin' || 
                       currentUser?.email?.toLowerCase() === 'jayeobapeace19459@gmail.com';
  
  const isAdmin = isSuperAdmin || 
                  userProfile?.role === 'admin' || 
                  userProfile?.role === 'executive';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        idToken,
        isAdmin,
        isSuperAdmin,
        isLoading,
        isFirebaseConfigured,
        loginWithGoogle,
        logout,
        getIdToken,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

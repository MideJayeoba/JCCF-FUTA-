import React, { createContext, useContext, useEffect } from 'react';
import { useAppStore, AppState, SuperAdminUser } from '../store/useAppStore';
import { useAuth } from './AuthContext';

export type { SuperAdminUser };
export type AppContextType = AppState;

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useAppStore();
  const { idToken, isSuperAdmin: isAuthSuperAdmin } = useAuth();

  // Sync token to store if available from Firebase Auth
  useEffect(() => {
    if (idToken && !store.adminToken) {
      useAppStore.setState({ adminToken: idToken, isSuperAdmin: true });
    }
  }, [idToken, store.adminToken]);

  // Initial fetch from PostgreSQL / Server DB
  useEffect(() => {
    store.fetchDbData();
  }, []);

  return (
    <AppContext.Provider value={store}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppState => {
  // Use zustand store directly for fastest updates, fallback to React Context
  const context = useContext(AppContext);
  const store = useAppStore();
  return context || store;
};

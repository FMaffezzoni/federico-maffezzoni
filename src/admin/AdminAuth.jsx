import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isLoggedIn, logoutAdmin } from '../content/api';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [authed, setAuthed] = useState(() => isLoggedIn());

  const login = useCallback(() => setAuthed(true), []);
  const logout = useCallback(() => {
    logoutAdmin();
    setAuthed(false);
  }, []);

  const value = useMemo(() => ({ authed, login, logout }), [authed, login, logout]);
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}

export function RequireAdmin({ children }) {
  const { authed } = useAdminAuth();
  const location = useLocation();
  if (!authed) return <Navigate to="/admin/login" replace state={{ from: location }} />;
  return children;
}

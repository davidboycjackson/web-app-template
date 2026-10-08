import { useMemo, useState, type ReactNode } from 'react';
import { AuthContext, type AuthContextValue } from './useAuth';

export type AuthUser = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  date_created: string;
};

const STORAGE_KEY = 'web_app_template_user';

const readStoredUser = (): AuthUser | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storedUser = window.localStorage.getItem(STORAGE_KEY);
    return storedUser ? (JSON.parse(storedUser) as AuthUser) : null;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());

  const loginUser = (nextUser: AuthUser) => {
    setUser(nextUser);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loginUser,
      logout,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

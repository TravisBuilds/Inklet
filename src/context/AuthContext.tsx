// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  hasAdultAccess: boolean;
  login: () => void;
  logout: () => void;
  grantAdultAccess: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const LOCAL_KEY_ADULT = "inklet.hasAdultAccess";
const LOCAL_KEY_USER = "inklet.user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [hasAdultAccess, setHasAdultAccess] = useState(false);

  // Restore from localStorage on mount
  useEffect(() => {
    try {
      const savedAdult = localStorage.getItem(LOCAL_KEY_ADULT);
      if (savedAdult === "true") {
        setHasAdultAccess(true);
      }
      const savedUser = localStorage.getItem(LOCAL_KEY_USER);
      if (savedUser) {
        const parsed = JSON.parse(savedUser) as User;
        setUser(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  const login = () => {
    // Stub: later replace with real Supabase auth
    const demoUser: User = { id: "demo-user", name: "Inklet Reader" };
    setUser(demoUser);
    localStorage.setItem(LOCAL_KEY_USER, JSON.stringify(demoUser));
  };

  const logout = () => {
    setUser(null);
    setHasAdultAccess(false);
    localStorage.removeItem(LOCAL_KEY_USER);
    localStorage.removeItem(LOCAL_KEY_ADULT);
  };

  const grantAdultAccess = () => {
    // Stub: in the future this is where you’d call your backend after Stripe/crypto success
    setHasAdultAccess(true);
    localStorage.setItem(LOCAL_KEY_ADULT, "true");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        hasAdultAccess,
        login,
        logout,
        grantAdultAccess
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface Profile {
  id: string;
  subscription_status: string | null;
  adult_access_until: string | null;
}

interface AuthContextValue {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  hasAdultAccess: boolean;
  signInWithMagicLink: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (u: any | null) => {
    if (!u) {
      setProfile(null);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("id, subscription_status, adult_access_until")
      .eq("id", u.id)
      .maybeSingle();
    setProfile(
      data ?? {
        id: u.id,
        subscription_status: "none",
        adult_access_until: null
      }
    );
  };

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
      loadProfile(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        loadProfile(session?.user ?? null);
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signInWithMagicLink = async (email: string) => {
    await supabase.auth.signInWithOtp({ email });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const hasAdultAccess = (() => {
    if (!profile?.adult_access_until) return false;
    const expiry = new Date(profile.adult_access_until).getTime();
    return expiry > Date.now();
  })();

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        hasAdultAccess,
        signInWithMagicLink,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

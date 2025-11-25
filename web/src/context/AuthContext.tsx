"use client";

import { createContext, useContext, useEffect, useState, useMemo, ReactNode } from "react";
import { User, onAuthStateChanged, signInWithPopup, GithubAuthProvider, signOut } from "firebase/auth";
import { initFirebase, FirebaseConfig, getFirebaseAuth } from "../lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
  apiBaseUrl: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGithub: async () => {},
  logout: async () => {},
  apiBaseUrl: "",
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
  config: FirebaseConfig;
  apiBaseUrl: string;
}

export const AuthProvider = ({ children, config, apiBaseUrl }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  // Initialize auth in useMemo to avoid side effects in render, but get the instance
  const auth = useMemo(() => {
    return initFirebase(config)?.auth;
  }, [config]);

  // Initial loading state depends on whether auth was initialized
  const [loading, setLoading] = useState(!!auth);

  useEffect(() => {
    if (!auth) {
      console.error("Failed to initialize Firebase Auth");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const signInWithGithub = async () => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with GitHub", error);
    }
  };

  const logout = async () => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  // Prevent rendering children until Firebase is initialized (optional, but safer)
  // or just let loading state handle it.

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGithub, logout, apiBaseUrl }}>
      {children}
    </AuthContext.Provider>
  );
};

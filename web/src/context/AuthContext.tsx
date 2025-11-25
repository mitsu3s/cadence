"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
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
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const { auth } = initFirebase(config) || {};
    if (!auth) {
      console.error("Failed to initialize Firebase Auth");
      setLoading(false);
      return;
    }
    setInitialized(true);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [config]);

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

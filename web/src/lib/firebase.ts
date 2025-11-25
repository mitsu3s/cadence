import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

let app: FirebaseApp | undefined;
let auth: Auth | undefined;

export const initFirebase = (config: FirebaseConfig) => {
  if (!config.apiKey) {
    console.warn("Firebase config is missing apiKey. Skipping initialization.");
    return null;
  }

  if (!getApps().length) {
    app = initializeApp(config);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
  return { app, auth };
};

export const getFirebaseAuth = () => auth;

import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import "../globals.css";

export const metadata: Metadata = {
  title: "Cadence - Development Rhythm Visualizer",
  description: "Visualize your development rhythm",
};

import { i18n } from "@/i18n-config";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // Runtime Configuration: Read from process.env on the server
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  };

  const apiBaseUrl = process.env.API_BASE_URL || "http://localhost:4000";

  return (
    <html lang={lang}>
      <body className="bg-black text-zinc-200 antialiased">
        <AuthProvider config={firebaseConfig} apiBaseUrl={apiBaseUrl}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

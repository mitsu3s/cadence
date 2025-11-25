import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Cadence",
  description: "Visualize your coding rhythm",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
    <html lang="en">
      <body className="bg-black text-zinc-200 antialiased flex overflow-hidden">
        <AuthProvider config={firebaseConfig} apiBaseUrl={apiBaseUrl}>
          <Suspense fallback={<div className="w-80 h-screen bg-zinc-950 border-r border-zinc-800" />}>
            <Sidebar />
          </Suspense>
          <main className="flex-1 overflow-y-auto h-screen relative">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}

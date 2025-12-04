"use client";

import { useAuth } from "@/context/AuthContext";
import DashboardContent from "./DashboardContent";
import LandingPage from "./LandingPage";
import Sidebar from "./Sidebar";
import { Suspense } from "react";

import { Locale } from "@/i18n-config";

import { Dictionary } from "@/get-dictionary";

interface Props {
  repo: string;
  days: number;
  dictionary: Dictionary;
  lang: Locale;
}

export default function HomeClient({ repo, days, dictionary, lang }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-zinc-500 animate-pulse">{dictionary.common.loading}</div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage dictionary={dictionary} lang={lang} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-blue-500/30 flex">
      <Suspense fallback={<div className="w-80 h-screen bg-zinc-950 border-r border-zinc-800" />}>
        <Sidebar dictionary={dictionary} lang={lang} />
      </Suspense>
      <main className="flex-1 md:pl-80 pt-16 md:pt-0 overflow-y-auto h-screen relative">
        <div className="container p-4 md:p-8 md:pt-12 mx-auto max-w-7xl">
          <header className="mb-10 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2">{dictionary.dashboard.title}</h1>
              <p className="text-zinc-400">
                {dictionary.dashboard.overview.replace("{repo}", "")} <span className="text-zinc-200 font-medium">{repo}</span>
              </p>
            </div>
          </header>
          <DashboardContent repo={repo} days={days} dictionary={dictionary} />
        </div>
      </main>
    </div>
  );
}
